import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AppError } from "../../platform/errors/app-error";
import { TenantBoundaryError } from "../../platform/errors/errors";
import { RequestContextService } from "../../platform/context/request-context.service";
import type { CreateLegalEntityDto } from "./dto/create-legal-entity.dto";
import { LegalEntityRepository } from "./legal-entity.repository";

@Injectable()
export class LegalEntityService {
  constructor(
    private readonly repository: LegalEntityRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateLegalEntityDto) {
    const tenantId = this.requireTenantId();
    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-001",
          code: "ORG-001",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A legal entity with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing legal entity.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-LEGAL-ENTITY",
        });
      }
      throw err;
    }
  }

  /** Every route on this service requires a resolved tenant; X-Tenant-Code is mandatory here. */
  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
