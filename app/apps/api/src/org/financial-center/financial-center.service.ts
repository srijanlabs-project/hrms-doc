import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError } from "../../platform/errors/errors";
import { CreateFinancialCenterDto } from "./dto/create-financial-center.dto";
import { FinancialCenterRepository } from "./financial-center.repository";

/** v1 slice — see schema.prisma's FinancialCenter comment (cost center + profit center + project hierarchy consolidated). */
@Injectable()
export class FinancialCenterService {
  constructor(
    private readonly repository: FinancialCenterRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateFinancialCenterDto) {
    const tenantId = this.requireTenantId();

    if (dto.parentCenterId) {
      const parent = await this.repository.findById(tenantId, dto.parentCenterId);
      if (!parent) {
        throw new NotFoundAppError("OBJ-FINANCIAL-CENTER", "The parent financial center could not be found.");
      }
    }

    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-005",
          code: "ORG-005",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A financial center with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing center.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-FINANCIAL-CENTER",
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
