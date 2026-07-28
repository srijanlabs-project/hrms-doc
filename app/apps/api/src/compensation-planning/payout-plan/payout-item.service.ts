import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IncentiveBonusService } from "../../payroll/incentive-bonus/incentive-bonus.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { ProposePayoutItemDto } from "./dto/propose-payout-item.dto";
import { PayoutCycleRepository } from "./payout-cycle.repository";
import { PayoutItemRepository } from "./payout-item.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-PAYOUT-ITEM-001",
    code: "PAYOUT-ITEM-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-PAYOUT-ITEM",
    details: { currentState },
  });
}

/**
 * Wave 3 E14 gap closure ("bonus planning", "incentives") — Proposed ->
 * Approved -> Posted (or Rejected). Posting reuses IncentiveBonusService.create()
 * directly, so a posted item rides the exact same ArrearEntry-backed payroll
 * consumption path a manually-granted incentive/bonus already uses — zero
 * new payout mechanism.
 */
@Injectable()
export class PayoutItemService {
  constructor(
    private readonly repository: PayoutItemRepository,
    private readonly cycleRepository: PayoutCycleRepository,
    private readonly incentiveBonusService: IncentiveBonusService,
    private readonly requestContext: RequestContextService,
  ) {}

  async propose(cycleId: string, dto: ProposePayoutItemDto) {
    const { tenantId } = this.requireAuthenticated();
    const cycle = await this.cycleRepository.findById(tenantId, cycleId);
    if (!cycle) {
      throw new NotFoundAppError("OBJ-PAYOUT-CYCLE", "Payout cycle not found.");
    }
    if (cycle.status !== "Open") {
      throw stateConflict("Items can only be added to an Open cycle.", cycle.status);
    }
    try {
      return await this.repository.create(tenantId, cycleId, {
        employeeId: dto.employeeId,
        proposedAmount: dto.proposedAmount,
        reason: dto.reason,
      });
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2002") {
        throw err;
      }
      throw stateConflict("This employee already has an item in this cycle.", "Duplicate");
    }
  }

  async listForCycle(cycleId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForCycle(tenantId, cycleId);
  }

  async approve(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const item = await this.findOrThrow(tenantId, id);
    if (item.status !== "Proposed") {
      throw stateConflict("Only a Proposed item can be approved.", item.status);
    }
    return this.repository.approve(tenantId, id);
  }

  async reject(id: string, decisionNote?: string) {
    const { tenantId } = this.requireAuthenticated();
    const item = await this.findOrThrow(tenantId, id);
    if (item.status !== "Proposed") {
      throw stateConflict("Only a Proposed item can be rejected.", item.status);
    }
    return this.repository.reject(tenantId, id, decisionNote);
  }

  async post(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const item = await this.findOrThrow(tenantId, id);
    if (item.status !== "Approved") {
      throw stateConflict("Only an Approved item can be posted.", item.status);
    }
    const cycle = await this.cycleRepository.findById(tenantId, item.cycleId);
    if (!cycle) {
      throw new NotFoundAppError("OBJ-PAYOUT-CYCLE", "Payout cycle not found.");
    }

    await this.incentiveBonusService.create({
      employeeId: item.employeeId,
      payType: cycle.payType as "Bonus" | "Incentive",
      amount: item.proposedAmount,
      reason: `${cycle.label}: ${item.reason}`,
    });
    return this.repository.markPosted(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const item = await this.repository.findById(tenantId, id);
    if (!item) {
      throw new NotFoundAppError("OBJ-PAYOUT-ITEM", "Payout plan item not found.");
    }
    return item;
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
