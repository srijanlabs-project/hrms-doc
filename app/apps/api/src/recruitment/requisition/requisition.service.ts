import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateRequisitionDto } from "./dto/create-requisition.dto";
import { RequisitionRepository } from "./requisition.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-REQUISITION-001",
    code: "REQUISITION-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-REQUISITION",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/06-recruitment-and-ats/02-requisitions.md:
 * a linear Draft -> Approved -> Published -> Closed lifecycle. Hold, cancel,
 * reopen, amendment history, and quantity-override authorization are
 * deferred — see schema.prisma's Requisition comment for the full state
 * collapse.
 */
@Injectable()
export class RequisitionService {
  constructor(
    private readonly repository: RequisitionRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async getById(id: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.findOrThrow(tenantId, id);
  }

  async create(dto: CreateRequisitionDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, {
        code: dto.code,
        title: dto.title,
        departmentId: dto.departmentId,
        hiringManagerId: dto.hiringManagerId,
        headcount: dto.headcount,
        compensationMin: dto.compensationMin,
        compensationMax: dto.compensationMax,
        targetJoinDate: dto.targetJoinDate ? new Date(dto.targetJoinDate) : undefined,
      });
    } catch {
      throw stateConflict(`A requisition with code "${dto.code}" already exists.`, "Duplicate");
    }
  }

  async approve(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const requisition = await this.findOrThrow(tenantId, id);
    if (requisition.status !== "Draft") {
      throw stateConflict("Only Draft requisitions can be approved.", requisition.status);
    }
    return this.repository.updateStatus(tenantId, id, {
      status: "Approved",
      approvedByUserId: userId,
      approvedAt: new Date(),
    });
  }

  async publish(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const requisition = await this.findOrThrow(tenantId, id);
    if (requisition.status !== "Approved") {
      throw stateConflict("Only Approved requisitions can be published.", requisition.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Published", publishedAt: new Date() });
  }

  async close(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const requisition = await this.findOrThrow(tenantId, id);
    if (requisition.status === "Closed" || requisition.status === "Cancelled") {
      throw stateConflict("This requisition is already closed.", requisition.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Closed", closedAt: new Date() });
  }

  private async findOrThrow(tenantId: string, id: string) {
    const requisition = await this.repository.findById(tenantId, id);
    if (!requisition) {
      throw new NotFoundAppError("OBJ-REQUISITION", "Requisition not found.");
    }
    return requisition;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
