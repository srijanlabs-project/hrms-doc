import { Injectable } from "@nestjs/common";
import { NotFoundAppError } from "../errors/errors";
import { NumberSeriesRepository, type SeriesDefaults } from "./number-series.repository";

/** entityType -> default prefix/padding, applied the first time a series is used. */
const SERIES_DEFAULTS: Record<string, SeriesDefaults> = {
  Employee: { prefix: "NH-", padding: 4 },
  Asset: { prefix: "AST-", padding: 4 },
};

/**
 * Number Series engine (Foundation & Platform, E00). Replaces the ad hoc
 * count-based `NH-${count + 1}` string in OfferService.convert() — not
 * race-safe under concurrent conversions — with one configurable, atomically
 * incremented series per entity type, reused for employee codes and asset
 * tags alike.
 */
@Injectable()
export class NumberSeriesService {
  constructor(private readonly repository: NumberSeriesRepository) {}

  async next(tenantId: string, entityType: keyof typeof SERIES_DEFAULTS): Promise<string> {
    const { prefix, padding, value } = await this.repository.allocate(tenantId, entityType, SERIES_DEFAULTS[entityType]);
    return `${prefix}${String(value).padStart(padding, "0")}`;
  }

  listAll(tenantId: string) {
    return this.repository.findAll(tenantId);
  }

  async updateConfig(tenantId: string, id: string, data: { prefix?: string; padding?: number }) {
    const existing = await this.repository.findById(tenantId, id);
    if (!existing) {
      throw new NotFoundAppError("OBJ-NUMBER-SERIES", "Number series not found.");
    }
    return this.repository.updateConfig(tenantId, id, data);
  }
}
