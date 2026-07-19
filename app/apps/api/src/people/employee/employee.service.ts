import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import type { FieldError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError, ValidationAppError } from "../../platform/errors/errors";
import { DepartmentRepository } from "../../org/department/department.repository";
import type { CreateEmployeeDto } from "./dto/create-employee.dto";
import { EmployeeRepository } from "./employee.repository";

/** VAL-001: trim and collapse repeated internal whitespace before persistence. */
function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

@Injectable()
export class EmployeeService {
  constructor(
    private readonly repository: EmployeeRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly requestContext: RequestContextService,
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
        dateOfBirth: dto.dateOfBirth,
        personalEmail: dto.personalEmail,
        mobileNumber: dto.mobileNumber,
        departmentId: dto.departmentId,
        managerId: dto.managerId,
        joiningDate: dto.joiningDate,
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

  /** Every route on this service requires a resolved tenant; X-Tenant-Code is mandatory here. */
  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
