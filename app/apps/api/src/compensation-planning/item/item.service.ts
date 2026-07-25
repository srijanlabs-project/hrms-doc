import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CompensationRepository } from "../../payroll/compensation/compensation.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { CycleRepository } from "../cycle/cycle.repository";
import { ItemRepository } from "./item.repository";
import type { ProposeItemDto } from "./dto/propose-item.dto";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-COMP-ITEM-001",
    code: "COMP-ITEM-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-COMP-ITEM",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/14-compensation-and-benefits/03-merit-cycles.md:
 * Proposed -> Approved -> Applied only, one item per employee per cycle.
 * Apply writes through to the existing EmployeeCompensation via
 * CompensationRepository — there is no separate publish/payroll-export batch.
 */
@Injectable()
export class ItemService {
  constructor(
    private readonly repository: ItemRepository,
    private readonly cycleRepository: CycleRepository,
    private readonly compensationRepository: CompensationRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async propose(cycleId: string, dto: ProposeItemDto) {
    const { tenantId } = this.requireAuthenticated();
    const cycle = await this.cycleRepository.findById(tenantId, cycleId);
    if (!cycle) {
      throw new NotFoundAppError("OBJ-COMP-CYCLE", "Compensation review cycle not found.");
    }
    if (cycle.status !== "Open") {
      throw stateConflict("Proposals can only be added to an Open cycle.", cycle.status);
    }
    const currentComp = await this.compensationRepository.findByEmployeeId(tenantId, dto.employeeId);
    try {
      return await this.repository.create(tenantId, cycleId, dto.employeeId, {
        currentMonthlyBasic: currentComp?.monthlyBasic ?? 0,
        proposedMonthlyBasic: dto.proposedMonthlyBasic,
      });
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2002") {
        throw err;
      }
      throw stateConflict("This employee already has a review item in this cycle.", "Duplicate");
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

  async apply(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const item = await this.findOrThrow(tenantId, id);
    if (item.status !== "Approved") {
      throw stateConflict("Only an Approved item can be applied.", item.status);
    }
    await this.compensationRepository.upsert(tenantId, item.employeeId, {
      monthlyBasic: item.proposedMonthlyBasic,
      effectiveFrom: new Date(),
    });
    return this.repository.apply(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const item = await this.repository.findById(tenantId, id);
    if (!item) {
      throw new NotFoundAppError("OBJ-COMP-ITEM", "Compensation review item not found.");
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
