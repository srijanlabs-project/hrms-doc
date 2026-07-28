import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../context/request-context.service";
import { AppError } from "../errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../errors/errors";
import type { CreateFeatureFlagDto } from "./dto/create-feature-flag.dto";
import { FeatureFlagRepository } from "./feature-flag.repository";

/**
 * W0·E30 DevOps and Operations — feature toggles. isEnabled() is the real
 * reusable seam any future service can call to gate behavior per tenant;
 * nothing in this codebase calls it yet (same "no current consumer" honesty
 * as the rest of this admin console), but the flag store and the check
 * itself are both real, not stubbed.
 */
@Injectable()
export class FeatureFlagService {
  constructor(
    private readonly repository: FeatureFlagRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async isEnabled(key: string): Promise<boolean> {
    const flag = await this.repository.findByKey(this.requireTenantId(), key);
    return flag?.enabled ?? false;
  }

  async create(dto: CreateFeatureFlagDto) {
    const tenantId = this.requireTenantId();
    try {
      return await this.repository.create(tenantId, {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        enabled: dto.enabled ?? false,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-FEATURE-FLAG-001",
          code: "FEATURE-FLAG-001",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A feature flag with key "${dto.key}" already exists.`,
          userAction: "Use a different key, or toggle the existing flag.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-FEATURE-FLAG",
        });
      }
      throw err;
    }
  }

  async setEnabled(key: string, enabled: boolean) {
    const tenantId = this.requireTenantId();
    const existing = await this.repository.findByKey(tenantId, key);
    if (!existing) {
      throw new NotFoundAppError("OBJ-FEATURE-FLAG", "Feature flag not found.");
    }
    return this.repository.setEnabled(tenantId, key, enabled);
  }

  async remove(key: string) {
    const tenantId = this.requireTenantId();
    const existing = await this.repository.findByKey(tenantId, key);
    if (!existing) {
      throw new NotFoundAppError("OBJ-FEATURE-FLAG", "Feature flag not found.");
    }
    await this.repository.delete(tenantId, key);
  }

  private requireTenantId(): string {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
