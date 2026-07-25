import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { TenantBoundaryError } from "../../platform/errors/errors";
import { DesignationRepository } from "./designation.repository";
import { CreateDesignationDto } from "./dto/create-designation.dto";

/** Career track (L2) folds in as a plain field — see schema.prisma's Designation comment. */
@Injectable()
export class DesignationService {
  constructor(
    private readonly repository: DesignationRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateDesignationDto) {
    const tenantId = this.requireTenantId();
    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-009",
          code: "ORG-009",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A designation with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing designation.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-DESIGNATION",
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
