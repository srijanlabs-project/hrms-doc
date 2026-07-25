import { Injectable } from "@nestjs/common";
import type { NumberSeries } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface SeriesDefaults {
  prefix: string;
  padding: number;
}

@Injectable()
export class NumberSeriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<NumberSeries[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.numberSeries.findMany({ where: { tenantId }, orderBy: { entityType: "asc" } }),
    );
  }

  /**
   * Atomically allocates the next number for (tenantId, entityType), creating
   * the series row with the given defaults on first use. The increment runs
   * as a single UPDATE, so Postgres's row-level lock serializes concurrent
   * callers — no two callers can ever receive the same number.
   */
  async allocate(tenantId: string, entityType: string, defaults: SeriesDefaults): Promise<{ prefix: string; padding: number; value: number }> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const series = await tx.numberSeries.upsert({
        where: { tenantId_entityType: { tenantId, entityType } },
        create: { tenantId, entityType, prefix: defaults.prefix, padding: defaults.padding, nextValue: 1 },
        update: {},
      });
      const updated = await tx.numberSeries.update({
        where: { id: series.id },
        data: { nextValue: { increment: 1 } },
      });
      return { prefix: updated.prefix, padding: updated.padding, value: updated.nextValue - 1 };
    });
  }
}
