import { Injectable } from "@nestjs/common";
import { NotFoundAppError } from "../errors/errors";
import { RequestContextService } from "../context/request-context.service";
import { SystemSettingRepository } from "./system-setting.repository";

/**
 * W0·E28 Administration — generic tenant config store. Deliberately a flat
 * key/value list rather than the spec's full dynamic-field/masters
 * framework: no current consumer needs per-tenant custom fields, so this
 * closes the "system settings"/"tenant controls" gap without over-building.
 */
@Injectable()
export class SystemSettingService {
  constructor(
    private readonly repository: SystemSettingRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  list() {
    return this.repository.findAll(this.tenantId);
  }

  upsert(key: string, value: string, description?: string) {
    return this.repository.upsert(this.tenantId, key, value, description);
  }

  async delete(key: string) {
    const existing = await this.repository.findAll(this.tenantId);
    if (!existing.some((s) => s.key === key)) {
      throw new NotFoundAppError("OBJ-SYSTEM-SETTING", "Setting not found.");
    }
    await this.repository.delete(this.tenantId, key);
  }
}
