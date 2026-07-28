import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreatePayoutCycleDto } from "./dto/create-payout-cycle.dto";
import { PayoutCycleRepository } from "./payout-cycle.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-PAYOUT-CYCLE-001",
    code: "PAYOUT-CYCLE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-PAYOUT-CYCLE",
    details: { currentState },
  });
}

/**
 * Wave 3 E14 gap closure ("bonus planning", "incentives") — one cycle model
 * covering both pay types, mirroring CycleService's exact Open/Closed shape.
 * No budget-pool tracking or guideline matrices — see schema.prisma's
 * PayoutPlanCycle comment.
 */
@Injectable()
export class PayoutCycleService {
  constructor(
    private readonly repository: PayoutCycleRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreatePayoutCycleDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, {
        periodYear: dto.periodYear,
        label: dto.label,
        payType: dto.payType,
        createdByUserId: userId,
      });
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2002") {
        throw err;
      }
      throw stateConflict("A payout cycle with this period, pay type, and label already exists.", "Duplicate");
    }
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async close(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const cycle = await this.findOrThrow(tenantId, id);
    if (cycle.status !== "Open") {
      throw stateConflict("Only an Open cycle can be closed.", cycle.status);
    }
    return this.repository.close(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const cycle = await this.repository.findById(tenantId, id);
    if (!cycle) {
      throw new NotFoundAppError("OBJ-PAYOUT-CYCLE", "Payout cycle not found.");
    }
    return cycle;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
