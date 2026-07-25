import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { ApplicationRepository } from "./application.repository";
import type { CreateApplicationDto } from "./dto/create-application.dto";

const TERMINAL_STAGES = ["Hired", "Rejected"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-APPLICATION-001",
    code: "APPLICATION-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-APPLICATION",
    details: { currentState },
  });
}

/**
 * v1 slice folding screening (05-screening.md), interview-scheduling
 * (06-interview-scheduling.md), and interview-feedback
 * (07-interview-feedback.md) into a single `stage` field — no separate
 * interview slots, scorecards, or panel feedback entities.
 */
@Injectable()
export class ApplicationService {
  constructor(
    private readonly repository: ApplicationRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async listForRequisition(requisitionId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForRequisition(tenantId, requisitionId);
  }

  async apply(dto: CreateApplicationDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, dto.requisitionId, dto.candidateId);
    } catch {
      throw stateConflict("This candidate has already applied to this requisition.", "Duplicate");
    }
  }

  async advance(id: string, stage: string) {
    const { tenantId } = this.requireAuthenticated();
    const application = await this.findOrThrow(tenantId, id);
    if (TERMINAL_STAGES.includes(application.stage)) {
      throw stateConflict(`This application is already ${application.stage.toLowerCase()}.`, application.stage);
    }
    return this.repository.updateStage(tenantId, id, { stage });
  }

  async reject(id: string, reason?: string) {
    const { tenantId } = this.requireAuthenticated();
    const application = await this.findOrThrow(tenantId, id);
    if (TERMINAL_STAGES.includes(application.stage)) {
      throw stateConflict(`This application is already ${application.stage.toLowerCase()}.`, application.stage);
    }
    return this.repository.updateStage(tenantId, id, { stage: "Rejected", rejectionReason: reason });
  }

  private async findOrThrow(tenantId: string, id: string) {
    const application = await this.repository.findById(tenantId, id);
    if (!application) {
      throw new NotFoundAppError("OBJ-APPLICATION", "Application not found.");
    }
    return application;
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
