import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { DelegationService } from "../../auth/delegation/delegation.service";
import { NotificationService } from "../../notifications/notification.service";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import {
  AuthenticationAppError,
  ForbiddenAppError,
  NotFoundAppError,
} from "../../platform/errors/errors";
import type { CreatePerDiemPolicyDto } from "./dto/create-per-diem-policy.dto";
import type { SubmitPerDiemClaimDto } from "./dto/submit-per-diem-claim.dto";
import { PerDiemClaimRepository } from "./per-diem-claim.repository";
import { PerDiemPolicyRepository } from "./per-diem-policy.repository";

type Decision = "Approved" | "Rejected";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-EXPENSE-002",
    code: "EXPENSE-002",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-PER-DIEM-CLAIM",
    details: { currentState },
  });
}

/**
 * Wave 3 W4·E17 gap closure ("per diem"). Claim lifecycle mirrors
 * ExpenseClaimService exactly (Pending -> Approved/Rejected -> Paid), but
 * computedAmount is a stored snapshot taken at submission time rather than a
 * live computation — like a benefits enrollment's allocated amount, it should
 * not silently change if the policy's daily rate is edited later.
 */
@Injectable()
export class PerDiemService {
  constructor(
    private readonly policyRepository: PerDiemPolicyRepository,
    private readonly claimRepository: PerDiemClaimRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly delegationService: DelegationService,
  ) {}

  async createPolicy(dto: CreatePerDiemPolicyDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.policyRepository.create(tenantId, {
      category: dto.category,
      dailyRate: dto.dailyRate,
      active: true,
    });
  }

  async listActivePolicies() {
    const { tenantId } = await this.currentEmployee.resolve();
    return this.policyRepository.findActive(tenantId);
  }

  async listAllPoliciesAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.policyRepository.findAll(tenantId);
  }

  async submitClaim(dto: SubmitPerDiemClaimDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const policy = await this.policyRepository.findById(tenantId, dto.policyId);
    if (!policy || !policy.active) {
      throw new NotFoundAppError("OBJ-PER-DIEM-POLICY", "Per diem policy not found.");
    }

    const { approverEmployeeId, approverUserId } = await this.resolveApprover(tenantId, employee.managerId);

    const claim = await this.claimRepository.create(tenantId, {
      employeeId: employee.id,
      policyId: policy.id,
      travelRequestId: dto.travelRequestId,
      numberOfDays: dto.numberOfDays,
      computedAmount: policy.dailyRate * dto.numberOfDays,
      approverId: approverEmployeeId,
    });

    if (approverUserId) {
      await this.notificationService.notify(tenantId, approverUserId, {
        type: "expense.perdiem.submitted",
        title: "New per diem claim",
        body: `${employee.legalName} submitted a ${policy.category} per diem claim for ${dto.numberOfDays} day(s).`,
        linkPath: "/expenses",
      });
    }

    return claim;
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.claimRepository.findForEmployee(tenantId, employee.id);
  }

  async listForApproval() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.claimRepository.findForApprover(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.claimRepository.findAll(tenantId);
  }

  async decide(id: string, decision: Decision, note?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const claim = await this.claimRepository.findById(tenantId, id);
    if (!claim) {
      throw new NotFoundAppError("OBJ-PER-DIEM-CLAIM", "Per diem claim not found.");
    }

    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedApprover = !!user?.employeeId && user.employeeId === claim.approverId;
    const isAdminOverride = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    let isDelegatedApprover = false;
    if (!isAssignedApprover && !isAdminOverride && claim.approverId) {
      const approverUser = await this.authRepository.findUserByEmployeeId(tenantId, claim.approverId);
      isDelegatedApprover = !!approverUser && (await this.delegationService.isDelegated(tenantId, userId, approverUser.id, "ExpenseApproval"));
    }
    if (!isAssignedApprover && !isAdminOverride && !isDelegatedApprover) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    if (claim.status !== "Pending") {
      throw stateConflict(`This claim is already ${claim.status.toLowerCase()}.`, claim.status);
    }

    await this.claimRepository.decide(tenantId, id, { status: decision, decisionNote: note, decidedByUserId: userId });

    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, claim.employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: `expense.perdiem.${decision.toLowerCase()}`,
        title: `Per diem claim ${decision.toLowerCase()}`,
        body: `Your ${claim.policy.category} per diem claim was ${decision.toLowerCase()}.`,
        linkPath: "/expenses",
      });
    }

    return this.claimRepository.findById(tenantId, id);
  }

  /** Admin-only stand-in, mirrors ExpenseClaimService.markPaid. */
  async markPaid(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const claim = await this.claimRepository.findById(tenantId, id);
    if (!claim) {
      throw new NotFoundAppError("OBJ-PER-DIEM-CLAIM", "Per diem claim not found.");
    }
    const count = await this.claimRepository.markPaid(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only an Approved claim can be marked as paid.", claim.status);
    }
    return this.claimRepository.findById(tenantId, id);
  }

  private async resolveApprover(tenantId: string, managerId: string | null) {
    if (!managerId) return { approverEmployeeId: undefined, approverUserId: undefined };
    const manager = await this.employeeRepository.findById(tenantId, managerId);
    if (!manager) return { approverEmployeeId: undefined, approverUserId: undefined };
    const managerUser = await this.authRepository.findUserByEmployeeId(tenantId, manager.id);
    return { approverEmployeeId: manager.id, approverUserId: managerUser?.id };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
