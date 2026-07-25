import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { CycleRepository } from "./cycle.repository";
import type { CreateCycleDto } from "./dto/create-cycle.dto";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-COMP-CYCLE-001",
    code: "COMP-CYCLE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-COMP-CYCLE",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/14-compensation-and-benefits/03-merit-cycles.md:
 * one cycle per period year, Open/Closed only — no budget pools, guideline
 * matrices, or planner hierarchies. See schema.prisma's CompensationReviewCycle
 * comment for the full list of collapsed spec features.
 */
@Injectable()
export class CycleService {
  constructor(
    private readonly repository: CycleRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateCycleDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, dto.periodYear);
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2002") {
        throw err;
      }
      throw stateConflict("A compensation review cycle for this period already exists.", "Duplicate");
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
      throw new NotFoundAppError("OBJ-COMP-CYCLE", "Compensation review cycle not found.");
    }
    return cycle;
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
