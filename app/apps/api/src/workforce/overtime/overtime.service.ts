import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { DelegationService } from "../../auth/delegation/delegation.service";
import { LeaveLedgerRepository } from "../../leave/ledger/leave-ledger.repository";
import { LeavePolicyRepository } from "../../leave/policy/leave-policy.repository";
import { CompensationRepository } from "../../payroll/compensation/compensation.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateOvertimeRequestDto } from "./dto/create-overtime-request.dto";
import { OvertimeRepository } from "./overtime.repository";

type Decision = "Approved" | "Rejected";

/** Estimate only — no worker-category/union policy engine; see schema.prisma's OvertimeRequest comment. */
const STANDARD_MONTHLY_HOURS = 30 * 8;
const OVERTIME_MULTIPLIER = 1.5;
const HOURS_PER_COMP_OFF_DAY = 8;
const COMP_OFF_LEAVE_TYPE = "Comp Off" as const;

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-OVERTIME-001",
    code: "OVERTIME-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-OVERTIME-REQUEST",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/07-workforce-management/06-overtime.md.
 * Open eligibility (no worker-category/union policy engine), no pre-approval
 * vs post-facto distinction, no comp-off conversion, no payroll export batch
 * — payableAmount is computed on approval as an estimate
 * (monthlyBasic / 240 hours x 1.5 x hoursRequested) and stays informational
 * until Payroll (E09) is deepened enough to actually consume it. Approval
 * permission pattern mirrors LeaveRequestService.
 */
@Injectable()
export class OvertimeService {
  constructor(
    private readonly repository: OvertimeRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly compensationRepository: CompensationRepository,
    private readonly leaveLedgerRepository: LeaveLedgerRepository,
    private readonly leavePolicyRepository: LeavePolicyRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly delegationService: DelegationService,
  ) {}

  async create(dto: CreateOvertimeRequestDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const { approverEmployeeId } = await this.resolveApprover(tenantId, employee.managerId);

    return this.repository.create(tenantId, {
      employeeId: employee.id,
      date: new Date(`${dto.date}T00:00:00.000Z`),
      hoursRequested: dto.hoursRequested,
      reason: dto.reason,
      approverId: approverEmployeeId,
      settlementType: dto.settlementType ?? "Payable",
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
    const request = await this.repository.findById(tenantId, id);
    if (!request) {
      throw new NotFoundAppError("OBJ-OVERTIME-REQUEST", "Overtime request not found.");
    }

    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedApprover = !!user?.employeeId && user.employeeId === request.approverId;
    const isAdminOverride = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    let isDelegatedApprover = false;
    if (!isAssignedApprover && !isAdminOverride && request.approverId) {
      const approverUser = await this.authRepository.findUserByEmployeeId(tenantId, request.approverId);
      isDelegatedApprover =
        !!approverUser && (await this.delegationService.isDelegated(tenantId, userId, approverUser.id, "OvertimeApproval"));
    }
    if (!isAssignedApprover && !isAdminOverride && !isDelegatedApprover) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    if (request.status !== "Pending") {
      throw stateConflict(`This request is already ${request.status.toLowerCase()}.`, request.status);
    }

    let payableAmount: number | undefined;
    let compOffDaysCredited: number | undefined;
    if (decision === "Approved" && request.settlementType === "CompOff") {
      compOffDaysCredited = Math.round((request.hoursRequested / HOURS_PER_COMP_OFF_DAY) * 100) / 100;
      await this.creditCompOff(tenantId, request.employeeId, compOffDaysCredited, userId, request.date);
    } else if (decision === "Approved") {
      const compensation = await this.compensationRepository.findByEmployeeId(tenantId, request.employeeId);
      if (compensation) {
        const hourlyRate = compensation.monthlyBasic / STANDARD_MONTHLY_HOURS;
        payableAmount = Math.round(hourlyRate * OVERTIME_MULTIPLIER * request.hoursRequested * 100) / 100;
      }
    }

    await this.repository.decide(tenantId, id, {
      status: decision,
      payableAmount,
      compOffDaysCredited,
      decisionNote: note,
      decidedByUserId: userId,
    });
    return this.repository.findById(tenantId, id);
  }

  /**
   * Reuses the Leave module's ledger (E08) rather than a parallel comp-off
   * balance table — crediting is just a signed Adjustment entry, and consuming
   * comp-off is applying for "Comp Off" leave through the existing leave-request
   * flow. Auto-creates the "Comp Off" policy (0 entitlement days — the entire
   * balance comes from credited ledger entries) the first time it's needed,
   * since it's infrastructure this feature requires to function at all, not a
   * per-tenant business decision an admin must remember to configure first.
   */
  private async creditCompOff(tenantId: string, employeeId: string, days: number, postedByUserId: string, date: Date) {
    let policy = await this.leavePolicyRepository.findByType(tenantId, COMP_OFF_LEAVE_TYPE);
    if (!policy) {
      policy = await this.leavePolicyRepository.create(tenantId, {
        leaveType: COMP_OFF_LEAVE_TYPE,
        name: COMP_OFF_LEAVE_TYPE,
        annualDays: 0,
      });
    }
    await this.leaveLedgerRepository.create(tenantId, {
      employeeId,
      leaveType: COMP_OFF_LEAVE_TYPE,
      periodYear: date.getUTCFullYear(),
      entryType: "Adjustment",
      amountDays: days,
      reason: `Comp-off credited for overtime on ${date.toISOString().slice(0, 10)}.`,
      postedByUserId,
    });
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
