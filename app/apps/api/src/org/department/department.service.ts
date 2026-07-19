import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError } from "../../platform/errors/errors";
import type { CreateDepartmentDto } from "./dto/create-department.dto";
import { DepartmentRepository } from "./department.repository";

@Injectable()
export class DepartmentService {
  constructor(
    private readonly repository: DepartmentRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateDepartmentDto) {
    const tenantId = this.requireTenantId();

    if (dto.parentDepartmentId) {
      const parent = await this.repository.findById(tenantId, dto.parentDepartmentId);
      if (!parent) {
        throw new NotFoundAppError("OBJ-DEPARTMENT", "The parent department could not be found.");
      }
    }

    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-002",
          code: "ORG-002",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A department with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing department.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-DEPARTMENT",
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
