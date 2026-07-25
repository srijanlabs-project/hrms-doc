import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { DelegationService } from "../../auth/delegation/delegation.service";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateTimesheetEntryDto } from "./dto/create-timesheet-entry.dto";
import { TimesheetRepository } from "./timesheet.repository";

type Decision = "Approved" | "Rejected";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-TIMESHEET-001",
    code: "TIMESHEET-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-TIMESHEET-ENTRY",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/07-workforce-management/05-timesheets.md.
 * No project/client/cost-center master data exists, so allocation is a
 * free-text activity label; no timesheet_header/period grouping, no dual
 * (manager + project-manager) approval, no billing/costing export. Approval
 * permission pattern mirrors LeaveRequestService (assigned manager, admin
 * override, or a TimesheetApproval/All delegate).
 */
@Injectable()
export class TimesheetService {
  constructor(
    private readonly repository: TimesheetRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly delegationService: DelegationService,
  ) {}

  async create(dto: CreateTimesheetEntryDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const { approverEmployeeId } = await this.resolveApprover(tenantId, employee.managerId);

    return this.repository.create(tenantId, {
      employeeId: employee.id,
      date: new Date(`${dto.date}T00:00:00.000Z`),
      hours: dto.hours,
      activity: dto.activity,
      status: "Submitted",
      approverId: approverEmployeeId,
    });
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async listForApproval() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForApprover(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async decide(id: string, decision: Decision, note?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const entry = await this.repository.findById(tenantId, id);
    if (!entry) {
      throw new NotFoundAppError("OBJ-TIMESHEET-ENTRY", "Timesheet entry not found.");
    }

    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedApprover = !!user?.employeeId && user.employeeId === entry.approverId;
    const isAdminOverride = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    let isDelegatedApprover = false;
    if (!isAssignedApprover && !isAdminOverride && entry.approverId) {
      const approverUser = await this.authRepository.findUserByEmployeeId(tenantId, entry.approverId);
      isDelegatedApprover =
        !!approverUser && (await this.delegationService.isDelegated(tenantId, userId, approverUser.id, "TimesheetApproval"));
    }
    if (!isAssignedApprover && !isAdminOverride && !isDelegatedApprover) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    if (entry.status !== "Submitted") {
      throw stateConflict(`This entry is already ${entry.status.toLowerCase()}.`, entry.status);
    }

    await this.repository.decide(tenantId, id, { status: decision, decisionNote: note, decidedByUserId: userId });
    return this.repository.findById(tenantId, id);
  }

  async withdraw(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const count = await this.repository.cancel(tenantId, id, employee.id);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-TIMESHEET-ENTRY", "Entry not found, not yours, or no longer submitted.");
    }
  }

  private async resolveApprover(tenantId: string, managerId: string | null) {
    if (!managerId) return { approverEmployeeId: undefined };
    const manager = await this.employeeRepository.findById(tenantId, managerId);
    return { approverEmployeeId: manager?.id };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
