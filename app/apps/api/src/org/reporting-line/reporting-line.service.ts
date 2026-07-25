import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError } from "../../platform/errors/errors";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { CreateReportingLineDto } from "./dto/create-reporting-line.dto";
import { ReportingLineRepository } from "./reporting-line.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-ORG-006",
    code: "ORG-006",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-REPORTING-LINE",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/01-organization-management/05-reporting-structure.md:
 * only the *supplementary* dotted/matrix/acting lines — Employee.managerId
 * remains the primary reporting line used everywhere else in this build.
 */
@Injectable()
export class ReportingLineService {
  constructor(
    private readonly repository: ReportingLineRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateReportingLineDto) {
    const tenantId = this.requireTenantId();

    const employee = await this.employeeRepository.findById(tenantId, dto.employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "employeeId does not reference an existing employee.");
    }
    const manager = await this.employeeRepository.findById(tenantId, dto.managerId);
    if (!manager) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "managerId does not reference an existing employee.");
    }

    return this.repository.create(tenantId, {
      employeeId: dto.employeeId,
      managerId: dto.managerId,
      lineType: dto.lineType,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      notes: dto.notes,
    });
  }

  async end(id: string) {
    const tenantId = this.requireTenantId();
    const line = await this.repository.findById(tenantId, id);
    if (!line) {
      throw new NotFoundAppError("OBJ-REPORTING-LINE", "Reporting line not found.");
    }
    const count = await this.repository.end(tenantId, id, new Date());
    if (count === 0) {
      throw stateConflict("Only an Active reporting line can be ended.", line.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
