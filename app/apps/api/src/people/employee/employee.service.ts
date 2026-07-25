import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AuditService } from "../../platform/audit/audit.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import type { FieldError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError, ValidationAppError } from "../../platform/errors/errors";
import { DepartmentRepository } from "../../org/department/department.repository";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import type { SeparateEmployeeDto } from "./dto/separate-employee.dto";
import type { UpdateOrgAssignmentDto } from "./dto/update-org-assignment.dto";
import { EmployeeRepository } from "./employee.repository";

export interface BulkImportRowResult {
  index: number;
  success: boolean;
  employeeCode?: string;
  error?: string;
}

/** VAL-001: trim and collapse repeated internal whitespace before persistence. */
function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

const NOT_SEPARABLE_STATUSES = ["Draft", "Separated", "Archived"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-PEOPLE-002",
    code: "PEOPLE-002",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-EMPLOYEE",
    details: { currentState },
  });
}

@Injectable()
export class EmployeeService {
  constructor(
    private readonly repository: EmployeeRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly requestContext: RequestContextService,
    private readonly audit: AuditService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async get(id: string) {
    const tenantId = this.requireTenantId();
    const employee = await this.repository.findById(tenantId, id);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "The requested employee could not be found.");
    }
    return employee;
  }

  async create(dto: CreateEmployeeDto) {
    const tenantId = this.requireTenantId();
    const fieldErrors: FieldError[] = [];

    // VAL-009: date of birth must be a valid calendar date in the past.
    if (dto.dateOfBirth && new Date(dto.dateOfBirth) >= new Date()) {
      fieldErrors.push({
        field: "dateOfBirth",
        code: "DATE_NOT_IN_PAST",
        message: "dateOfBirth must be in the past.",
      });
    }

    if (dto.departmentId) {
      const department = await this.departmentRepository.findById(tenantId, dto.departmentId);
      if (!department) {
        fieldErrors.push({
          field: "departmentId",
          code: "NOT_FOUND",
          message: "departmentId does not reference an existing department in this tenant.",
        });
      }
    }

    if (dto.managerId) {
      const manager = await this.repository.findById(tenantId, dto.managerId);
      if (!manager) {
        fieldErrors.push({
          field: "managerId",
          code: "NOT_FOUND",
          message: "managerId does not reference an existing employee in this tenant.",
        });
      }
    }

    if (fieldErrors.length > 0) {
      throw new ValidationAppError(fieldErrors);
    }

    try {
      return await this.repository.create(tenantId, {
        employeeCode: dto.employeeCode,
        legalName: normalizeName(dto.legalName),
        preferredName: dto.preferredName ? normalizeName(dto.preferredName) : undefined,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        personalEmail: dto.personalEmail,
        mobileNumber: dto.mobileNumber,
        departmentId: dto.departmentId,
        managerId: dto.managerId,
        joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : undefined,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-PEOPLE-001",
          code: "PEOPLE-001",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `An employee with code "${dto.employeeCode}" already exists.`,
          userAction: "Use a different employee code, or edit the existing record.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-EMPLOYEE",
        });
      }
      throw err;
    }
  }

  /**
   * Bulk import (T-006 workbench): validates and creates each row
   * independently — one bad row doesn't block the rest. Every row runs the
   * exact same CreateEmployeeDto rules and create() logic as the single-row
   * endpoint, just not through the global ValidationPipe (see
   * BulkImportEmployeesDto for why).
   */
  async bulkCreate(rows: Record<string, unknown>[]): Promise<BulkImportRowResult[]> {
    const results: BulkImportRowResult[] = [];
    for (let index = 0; index < rows.length; index++) {
      const dto = plainToInstance(CreateEmployeeDto, rows[index]);
      const validationErrors = await validate(dto);
      if (validationErrors.length > 0) {
        const message = validationErrors
          .flatMap((e) => Object.values(e.constraints ?? {}))
          .join("; ");
        results.push({ index, success: false, error: message });
        continue;
      }

      try {
        const created = await this.create(dto);
        results.push({ index, success: true, employeeCode: created.employeeCode });
      } catch (err) {
        results.push({ index, success: false, error: err instanceof AppError ? err.message : "Unknown error" });
      }
    }
    return results;
  }

  /**
   * v1 slice of docs/08-submodule-specifications/02-people-management/13-exit.md:
   * a direct status + date + reason transition, admin-triggered. No exit
   * interview, clearance checklist, asset-return linkage, or F&F-settlement
   * automation — see schema.prisma's Employee.lastWorkingDay comment. The
   * employee's User account is left untouched (still logs in via OTP as
   * normal); ExitStatusGuard is what actually restricts what a Separated
   * employee can reach afterward.
   */
  /** Wave 1 Org Management deepening: direct position/grade/financial-center/worker-type assignment — no promotion/transfer workflow or effective-dated history yet. */
  async updateOrgAssignment(id: string, dto: UpdateOrgAssignmentDto) {
    const tenantId = this.requireTenantId();
    await this.get(id);
    return this.repository.updateOrgAssignment(tenantId, id, dto);
  }

  async separate(id: string, dto: SeparateEmployeeDto) {
    const tenantId = this.requireTenantId();
    const employee = await this.get(id);
    if (NOT_SEPARABLE_STATUSES.includes(employee.status)) {
      throw stateConflict(`Cannot mark this employee as separated from status "${employee.status}".`, employee.status);
    }
    const separated = await this.repository.markSeparated(tenantId, id, new Date(dto.lastWorkingDay), dto.reason);
    await this.audit.record({
      entityType: "Employee",
      entityId: id,
      action: "Employee.separate",
      before: { status: employee.status },
      after: { status: "Separated", lastWorkingDay: dto.lastWorkingDay, reason: dto.reason },
    });
    return separated;
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
