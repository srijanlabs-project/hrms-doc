import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError } from "../../platform/errors/errors";
import { CreateOrgUnitDto } from "./dto/create-org-unit.dto";
import { OrgUnitRepository } from "./org-unit.repository";

/** v1 slice — see schema.prisma's OrgUnit comment for the collapse rationale (business unit/division/section-team/branch/region/campus/location all as one type-tagged hierarchy). */
@Injectable()
export class OrgUnitService {
  constructor(
    private readonly repository: OrgUnitRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateOrgUnitDto) {
    const tenantId = this.requireTenantId();

    if (dto.parentUnitId) {
      const parent = await this.repository.findById(tenantId, dto.parentUnitId);
      if (!parent) {
        throw new NotFoundAppError("OBJ-ORG-UNIT", "The parent org unit could not be found.");
      }
    }

    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-004",
          code: "ORG-004",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `An org unit with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing unit.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-ORG-UNIT",
        });
      }
      throw err;
    }
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
