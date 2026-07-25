import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../auth.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { CreateDelegationDto } from "./dto/create-delegation.dto";
import { DelegationRepository } from "./delegation.repository";

/**
 * Delegation engine (Identity and Access, 06-delegation.md) — v1 slice: one
 * scope tag per delegation (LeaveApproval/ExpenseApproval/TravelApproval/All)
 * rather than a generic workflow-type registry, self-requested only (no
 * manager-requested/admin-assigned/auto-suggested paths), no approval step on
 * the delegation itself, no SoD/conflict engine. Real effect: isDelegated()
 * is called from Leave/Expense/Travel's decide() methods alongside the
 * existing assigned-approver-or-admin-override check.
 */
@Injectable()
export class DelegationService {
  constructor(
    private readonly repository: DelegationRepository,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateDelegationDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    if (dto.delegateUserId === userId) {
      throw new ValidationAppError([
        { field: "delegateUserId", code: "SELF_DELEGATION", message: "You cannot delegate to yourself." },
      ]);
    }
    if (new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new ValidationAppError([{ field: "endDate", code: "BEFORE_START", message: "endDate must be on or after startDate." }]);
    }
    const delegate = await this.authRepository.findUserById(tenantId, dto.delegateUserId);
    if (!delegate) {
      throw new ValidationAppError([{ field: "delegateUserId", code: "NOT_FOUND", message: "That user was not found." }]);
    }
    return this.repository.create(tenantId, userId, userId, dto);
  }

  async listMine() {
    const { tenantId, userId } = this.requireAuthenticated();
    const [given, received] = await Promise.all([
      this.repository.findMineGiven(tenantId, userId),
      this.repository.findMineReceived(tenantId, userId),
    ]);
    return { given, received };
  }

  async revoke(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const delegation = await this.repository.findById(tenantId, id);
    if (!delegation) {
      throw new NotFoundAppError("OBJ-DELEGATION", "Delegation not found.");
    }
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isOwner = delegation.delegatorUserId === userId;
    const isAdmin = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isOwner && !isAdmin) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return this.repository.revoke(tenantId, id);
  }

  /** Called by Leave/Expense/Travel decide() alongside their own assigned-approver-or-admin check. */
  isDelegated(tenantId: string, actingUserId: string, originalApproverUserId: string, scope: string): Promise<boolean> {
    return this.repository.hasActiveMatch(tenantId, actingUserId, originalApproverUserId, scope, new Date());
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
