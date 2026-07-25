import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError } from "../../platform/errors/errors";
import { DepartmentRepository } from "../department/department.repository";
import { CreatePositionDto } from "./dto/create-position.dto";
import { PositionRepository } from "./position.repository";

/**
 * v1 slice — position management has no dedicated spec file at all (a real
 * catalog gap). Modeled as a budgeted seat in a department, optionally
 * linked to a designation, that an employee may occupy via
 * Employee.positionId — no headcount-budget ledger or requisition linkage.
 */
@Injectable()
export class PositionService {
  constructor(
    private readonly repository: PositionRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreatePositionDto) {
    const tenantId = this.requireTenantId();

    const department = await this.departmentRepository.findById(tenantId, dto.departmentId);
    if (!department) {
      throw new NotFoundAppError("OBJ-DEPARTMENT", "departmentId does not reference an existing department.");
    }

    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-011",
          code: "ORG-011",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A position with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing position.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-POSITION",
        });
      }
      throw err;
    }
  }

  async updateStatus(id: string, status: string) {
    const tenantId = this.requireTenantId();
    const position = await this.repository.findById(tenantId, id);
    if (!position) {
      throw new NotFoundAppError("OBJ-POSITION", "Position not found.");
    }
    return this.repository.updateStatus(tenantId, id, status);
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
