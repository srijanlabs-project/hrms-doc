import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../auth/auth.repository";
import { DelegationService } from "../auth/delegation/delegation.service";
import { NotificationService } from "../notifications/notification.service";
import { CurrentEmployeeService } from "../people/current-employee.service";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { RequestContextService } from "../platform/context/request-context.service";
import { AppError } from "../platform/errors/app-error";
import {
  AuthenticationAppError,
  ForbiddenAppError,
  NotFoundAppError,
} from "../platform/errors/errors";
import { WebhookDispatchService } from "../webhook/webhook.service";
import { ExpenseClaimRepository } from "./expense-claim.repository";
import type { CreateExpenseClaimDto } from "./dto/create-expense-claim.dto";

type Decision = "Approved" | "Rejected";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-EXPENSE-001",
    code: "EXPENSE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-EXPENSE-CLAIM",
    details: { currentState },
  });
}

/**
 * v1 slice — see schema.prisma's ExpenseClaim comment for the full list of
 * collapsed spec features. Approval permission pattern mirrors
 * LeaveRequestService exactly (assigned manager or org_admin/hr_ops override).
 */
@Injectable()
export class ExpenseClaimService {
  constructor(
    private readonly repository: ExpenseClaimRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly delegationService: DelegationService,
    private readonly webhookDispatchService: WebhookDispatchService,
  ) {}

  async create(dto: CreateExpenseClaimDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const { approverEmployeeId, approverUserId } = await this.resolveApprover(tenantId, employee.managerId);

    const claim = await this.repository.create(tenantId, {
      employeeId: employee.id,
      category: dto.category,
      amount: dto.amount,
      expenseDate: new Date(dto.expenseDate),
      merchant: dto.merchant,
      businessPurpose: dto.businessPurpose,
      approverId: approverEmployeeId,
    });

    if (approverUserId) {
      await this.notificationService.notify(tenantId, approverUserId, {
        type: "expense.claim.submitted",
        title: "New expense claim",
        body: `${employee.legalName} submitted a ${dto.category} claim for ₹${dto.amount.toLocaleString("en-IN")}.`,
        linkPath: "/expenses",
      });
    }

    return claim;
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
    const claim = await this.repository.findById(tenantId, id);
    if (!claim) {
      throw new NotFoundAppError("OBJ-EXPENSE-CLAIM", "Expense claim not found.");
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

    await this.repository.decide(tenantId, id, { status: decision, decisionNote: note, decidedByUserId: userId });

    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, claim.employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: `expense.claim.${decision.toLowerCase()}`,
        title: `Expense claim ${decision.toLowerCase()}`,
        body: `Your ${claim.category} claim for ₹${claim.amount.toLocaleString("en-IN")} was ${decision.toLowerCase()}.`,
        linkPath: "/expenses",
      });
    }

    await this.webhookDispatchService.dispatch(tenantId, `expense.claim.${decision.toLowerCase()}`, {
      claimId: id,
      employeeId: claim.employeeId,
      category: claim.category,
      amount: claim.amount,
      status: decision,
    });

    return this.repository.findById(tenantId, id);
  }

  async cancel(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const count = await this.repository.cancel(tenantId, id, employee.id);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-EXPENSE-CLAIM", "Claim not found, not yours, or no longer pending.");
    }
  }

  /** Admin-only stand-in for the whole Reimbursements submodule — see schema.prisma's ExpenseClaim comment. */
  async markPaid(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const claim = await this.repository.findById(tenantId, id);
    if (!claim) {
      throw new NotFoundAppError("OBJ-EXPENSE-CLAIM", "Expense claim not found.");
    }
    const count = await this.repository.markPaid(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only an Approved claim can be marked as paid.", claim.status);
    }
    return this.repository.findById(tenantId, id);
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
