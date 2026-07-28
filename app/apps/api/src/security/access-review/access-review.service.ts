import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError } from "../../platform/errors/errors";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuditService } from "../../platform/audit/audit.service";
import { AccessReviewRepository } from "./access-review.repository";

function stateConflict(message: string) {
  return new AppError({
    errorRef: "ERR-ACCESS-REVIEW-001",
    code: "ACCESS-REVIEW-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ACCESS-REVIEW",
  });
}

/**
 * W0·E29 Security and Governance — periodic access certification. Revoking
 * an item has a real, immediate effect: it suspends the target user (who can
 * no longer sign in — AuthService's login checks require status "Active")
 * and kills their live sessions, not just a paper decision.
 */
@Injectable()
export class AccessReviewService {
  constructor(
    private readonly repository: AccessReviewRepository,
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
    private readonly authRepository: AuthRepository,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  async startCycle(periodLabel: string) {
    const open = await this.repository.findOpenCycle(this.tenantId);
    if (open) {
      throw stateConflict("An access review cycle is already open — close it before starting a new one.");
    }
    const users = await this.repository.findActiveUsersForReview(this.tenantId);
    return this.repository.createCycle(this.tenantId, periodLabel, users);
  }

  listCycles() {
    return this.repository.findAllCycles(this.tenantId);
  }

  /** Compliance-overview rollup consumer — summarizes the currently open cycle, if any. */
  async getOpenCycleSummary() {
    const cycles = await this.repository.findAllCycles(this.tenantId);
    const open = cycles.find((c) => c.status === "Open");
    if (!open) return null;
    const pendingItems = await this.repository.countPendingItems(this.tenantId, open.id);
    return { id: open.id, periodLabel: open.periodLabel, totalItems: open._count.items, pendingItems };
  }

  async getCycle(id: string) {
    const cycle = await this.repository.findCycleWithItems(this.tenantId, id);
    if (!cycle) {
      throw new NotFoundAppError("OBJ-ACCESS-REVIEW", "Access review cycle not found.");
    }
    return cycle;
  }

  async confirmItem(itemId: string) {
    const item = await this.findPendingItemOrThrow(itemId);
    return this.repository.decideItem(this.tenantId, item.id, "Confirmed", this.requestContext.userId!);
  }

  async revokeItem(itemId: string, notes?: string) {
    const item = await this.findPendingItemOrThrow(itemId);
    const decided = await this.repository.decideItem(this.tenantId, item.id, "Revoked", this.requestContext.userId!, notes);

    await this.repository.suspendUser(this.tenantId, item.userId);
    const sessions = await this.authRepository.findActiveSessionsForUser(this.tenantId, item.userId);
    for (const session of sessions) {
      await this.authRepository.revokeSession(this.tenantId, session.id);
    }
    await this.auditService.record({
      entityType: "User",
      entityId: item.userId,
      action: "AccessRevoked",
      before: { status: "Active" },
      after: { status: "Suspended" },
    });

    return decided;
  }

  async closeCycle(id: string) {
    const cycle = await this.getCycle(id);
    if (cycle.status === "Closed") {
      throw stateConflict("This cycle is already closed.");
    }
    const pending = await this.repository.countPendingItems(this.tenantId, id);
    if (pending > 0) {
      throw stateConflict(`${pending} item(s) still need a decision before this cycle can close.`);
    }
    return this.repository.closeCycle(this.tenantId, id);
  }

  private async findPendingItemOrThrow(itemId: string) {
    const item = await this.repository.findItemById(this.tenantId, itemId);
    if (!item) {
      throw new NotFoundAppError("OBJ-ACCESS-REVIEW", "Access review item not found.");
    }
    if (item.decision !== "Pending") {
      throw stateConflict("This item has already been decided.");
    }
    return item;
  }
}
