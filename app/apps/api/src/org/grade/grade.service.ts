import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { TenantBoundaryError } from "../../platform/errors/errors";
import { CreateGradeDto } from "./dto/create-grade.dto";
import { GradeRepository } from "./grade.repository";

/** v1 slice of docs/08-submodule-specifications/01-organization-management/07-grade-and-band.md — band folded into a plain field. */
@Injectable()
export class GradeService {
  constructor(
    private readonly repository: GradeRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateGradeDto) {
    const tenantId = this.requireTenantId();
    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-010",
          code: "ORG-010",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A grade with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing grade.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-GRADE",
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
