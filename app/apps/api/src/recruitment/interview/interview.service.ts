import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { ApplicationRepository } from "../candidate/application.repository";
import type { ScheduleInterviewDto } from "./dto/schedule-interview.dto";
import type { SubmitFeedbackDto } from "./dto/submit-feedback.dto";
import { InterviewFeedbackRepository } from "./interview-feedback.repository";
import { InterviewRoundRepository } from "./interview-round.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-INTERVIEW-001",
    code: "INTERVIEW-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-INTERVIEW-ROUND",
    details: { currentState },
  });
}

/**
 * v1 slice of 06-interview-scheduling.md and 07-interview-feedback.md.
 * Rounds are single-interviewer (no panel), round number auto-increments
 * per application, and there's no calendar-provider sync or reschedule
 * endpoint — cancel and reschedule fresh instead.
 */
@Injectable()
export class InterviewService {
  constructor(
    private readonly roundRepository: InterviewRoundRepository,
    private readonly feedbackRepository: InterviewFeedbackRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async listForApplication(applicationId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.roundRepository.findForApplication(tenantId, applicationId);
  }

  async schedule(dto: ScheduleInterviewDto) {
    const { tenantId } = this.requireAuthenticated();
    const application = await this.applicationRepository.findById(tenantId, dto.applicationId);
    if (!application) {
      throw new NotFoundAppError("OBJ-APPLICATION", "Application not found.");
    }
    if (application.stage === "Hired" || application.stage === "Rejected") {
      throw new ValidationAppError([
        { field: "applicationId", code: "TERMINAL_STAGE", message: `This application is already ${application.stage.toLowerCase()}.` },
      ]);
    }

    const existingRounds = await this.roundRepository.countForApplication(tenantId, dto.applicationId);
    return this.roundRepository.create(tenantId, {
      applicationId: dto.applicationId,
      roundNumber: existingRounds + 1,
      interviewerId: dto.interviewerId,
      scheduledAt: new Date(dto.scheduledAt),
      mode: dto.mode ?? "Video",
    });
  }

  async cancel(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const round = await this.findOrThrow(tenantId, id);
    if (round.status !== "Scheduled") {
      throw stateConflict(`This interview round is already ${round.status.toLowerCase()}.`, round.status);
    }
    return this.roundRepository.updateStatus(tenantId, id, "Cancelled");
  }

  async submitFeedback(roundId: string, dto: SubmitFeedbackDto) {
    const { tenantId } = this.requireAuthenticated();
    const round = await this.findOrThrow(tenantId, roundId);
    if (round.status === "Cancelled") {
      throw stateConflict("This interview round was cancelled.", round.status);
    }
    if (round.feedback) {
      throw stateConflict("Feedback has already been submitted for this round.", round.status);
    }

    const feedback = await this.feedbackRepository.create(tenantId, roundId, {
      rating: dto.rating,
      recommendation: dto.recommendation,
      comments: dto.comments,
    });
    await this.roundRepository.updateStatus(tenantId, roundId, "Completed");
    return feedback;
  }

  private async findOrThrow(tenantId: string, id: string) {
    const round = await this.roundRepository.findById(tenantId, id);
    if (!round) {
      throw new NotFoundAppError("OBJ-INTERVIEW-ROUND", "Interview round not found.");
    }
    return round;
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
