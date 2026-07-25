import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ValidationAppError } from "../../platform/errors/errors";
import { round2 } from "../calc/payroll-calculator";
import type { AssignPayComponentDto } from "./dto/assign-pay-component.dto";
import type { CreatePayComponentDto } from "./dto/create-pay-component.dto";
import { PayComponentRepository, type EmployeePayComponentWithComponent } from "./pay-component.repository";

function componentCodeConflict(code: string) {
  return new AppError({
    errorRef: "ERR-PAYCOMPONENT-001",
    code: "PAYCOMPONENT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message: `A pay component with code "${code}" already exists.`,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-PAY-COMPONENT",
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/09-payroll/02-pay-components.md.
 * No version history, formula engine, GL/dependency mapping, or approval
 * workflow — a flat catalog plus per-employee assignment feeding straight
 * into computeGrossToNet's componentEarnings/componentDeductions inputs.
 */
@Injectable()
export class PayComponentService {
  constructor(
    private readonly repository: PayComponentRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async createComponent(dto: CreatePayComponentDto) {
    const { tenantId } = this.requireAuthenticated();
    const existing = await this.repository.findComponentByCode(tenantId, dto.code);
    if (existing) {
      throw componentCodeConflict(dto.code);
    }
    return this.repository.createComponent(tenantId, dto);
  }

  async listComponents() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listComponents(tenantId);
  }

  async assign(dto: AssignPayComponentDto) {
    const { tenantId } = this.requireAuthenticated();
    const component = await this.repository.findComponentById(tenantId, dto.payComponentId);
    if (!component) {
      throw new ValidationAppError([{ field: "payComponentId", code: "NOT_FOUND", message: "Pay component not found." }]);
    }
    const employee = await this.employeeRepository.findById(tenantId, dto.employeeId);
    if (!employee) {
      throw new ValidationAppError([{ field: "employeeId", code: "NOT_FOUND", message: "Employee not found." }]);
    }
    return this.repository.assign(tenantId, dto);
  }

  async listForEmployee(employeeId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForEmployee(tenantId, employeeId);
  }

  /** Bulk fetch for payroll run processing — one query for every employee in the run. */
  async findActiveForEmployeeIds(tenantId: string, employeeIds: string[]) {
    return this.repository.findActiveForEmployeeIds(tenantId, employeeIds);
  }

  /** proratedBasic must already reflect payableDays/totalWorkingDays — PercentOfBasic components scale off it directly. */
  computeTotals(assignments: EmployeePayComponentWithComponent[], proratedBasic: number): { earnings: number; deductions: number } {
    let earnings = 0;
    let deductions = 0;
    for (const assignment of assignments) {
      const value = assignment.value ?? assignment.payComponent.defaultValue;
      const amount = assignment.payComponent.calculationMethod === "PercentOfBasic" ? proratedBasic * value : value;
      if (assignment.payComponent.type === "Earning") earnings += amount;
      else deductions += amount;
    }
    return { earnings: round2(earnings), deductions: round2(deductions) };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
