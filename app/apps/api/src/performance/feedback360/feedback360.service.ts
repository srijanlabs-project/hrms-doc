import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import type { CampaignWithRaters, RaterWithEmployee } from "./feedback360.repository";
import { Feedback360Repository } from "./feedback360.repository";
import type { CreateFeedbackCampaignDto } from "./dto/create-campaign.dto";
import type { NominateRaterDto } from "./dto/nominate-rater.dto";
import type { SubmitFeedback360ResponseDto } from "./dto/submit-response.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-FEEDBACK360-001",
    code: "FEEDBACK360-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-FEEDBACK-CAMPAIGN",
    details: { currentState },
  });
}

/**
 * v1 slice of 03-360-feedback.md: one subject employee per campaign per
 * cycle, a fixed rating+two-text-field questionnaire (no question bank), no
 * tokenized rater links or anonymity-threshold enforcement (a small
 * single-tenant deployment has no real anonymity risk to model), no
 * reminders. Managed by the subject's manager or org_admin/hr_ops; raters
 * respond self-service.
 */
@Injectable()
export class Feedback360Service {
  constructor(
    private readonly repository: Feedback360Repository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateFeedbackCampaignDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const subject = await this.employeeRepository.findById(tenantId, dto.subjectEmployeeId);
    if (!subject) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Subject employee not found.");
    }
    await this.requireManagerOrAdmin(tenantId, userId, subject.managerId);
    try {
      return await this.repository.create(tenantId, {
        subjectEmployeeId: dto.subjectEmployeeId,
        cycleYear: dto.cycleYear,
        createdByUserId: userId,
      });
    } catch {
      throw stateConflict("A 360 campaign for this employee and cycle already exists.", "Duplicate");
    }
  }

  async listForSubject(subjectEmployeeId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForSubject(tenantId, subjectEmployeeId);
  }

  /** Self-service: the subject's own view of their released (Closed) campaigns — aggregated only, raters not attributed. */
  async myReleasedSummaries() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const campaigns = await this.repository.findForSubject(tenantId, employee.id);
    return campaigns.filter((c) => c.status === "Closed").map((c) => summarize(c));
  }

  /** Self-service: pending feedback requests where the current employee is a nominated rater. */
  async myPendingRequests() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findPendingForRater(tenantId, employee.id);
  }

  async nominateRater(campaignId: string, dto: NominateRaterDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const campaign = await this.findOrThrow(tenantId, campaignId);
    await this.requireManagerOrAdmin(tenantId, userId, campaign.subjectEmployee.managerId);
    if (campaign.status !== "Draft") {
      throw stateConflict("Raters can only be nominated while the campaign is Draft.", campaign.status);
    }
    try {
      return await this.repository.addRater(tenantId, campaignId, dto);
    } catch {
      throw stateConflict("This employee has already been nominated as a rater for this campaign.", "Duplicate");
    }
  }

  async open(campaignId: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const campaign = await this.findOrThrow(tenantId, campaignId);
    await this.requireManagerOrAdmin(tenantId, userId, campaign.subjectEmployee.managerId);
    if (campaign.status !== "Draft") {
      throw stateConflict("Only a Draft campaign can be opened.", campaign.status);
    }
    if (campaign.raters.length === 0) {
      throw new ValidationAppError([
        { field: "raters", code: "NO_RATERS", message: "Nominate at least one rater before opening the campaign." },
      ]);
    }
    return this.repository.updateStatus(tenantId, campaignId, { status: "Open" });
  }

  async close(campaignId: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const campaign = await this.findOrThrow(tenantId, campaignId);
    await this.requireManagerOrAdmin(tenantId, userId, campaign.subjectEmployee.managerId);
    if (campaign.status !== "Open") {
      throw stateConflict("Only an Open campaign can be closed.", campaign.status);
    }
    return this.repository.updateStatus(tenantId, campaignId, { status: "Closed", closedAt: new Date() });
  }

  async submitResponse(raterId: string, dto: SubmitFeedback360ResponseDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const rater = await this.findRaterOrThrow(tenantId, raterId);
    if (rater.raterEmployeeId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    if (rater.status !== "Invited") {
      throw stateConflict("This feedback response has already been submitted.", rater.status);
    }
    return this.repository.submitResponse(tenantId, raterId, {
      rating: dto.rating,
      strengths: dto.strengths,
      developmentAreas: dto.developmentAreas,
    });
  }

  private async requireManagerOrAdmin(tenantId: string, userId: string, subjectManagerId: string | null) {
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedManager = !!user?.employeeId && user.employeeId === subjectManagerId;
    const isAdminOverride = !!user?.roles.some((role) => ADMIN_ROLES.includes(role));
    if (!isAssignedManager && !isAdminOverride) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
  }

  private async findOrThrow(tenantId: string, id: string) {
    const campaign = await this.repository.findById(tenantId, id);
    if (!campaign) {
      throw new NotFoundAppError("OBJ-FEEDBACK-CAMPAIGN", "360 feedback campaign not found.");
    }
    return campaign;
  }

  private async findRaterOrThrow(tenantId: string, id: string): Promise<RaterWithEmployee> {
    const rater = await this.repository.findRaterById(tenantId, id);
    if (!rater) {
      throw new NotFoundAppError("OBJ-FEEDBACK-RATER", "Feedback rater not found.");
    }
    return rater;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}

function summarize(campaign: CampaignWithRaters) {
  const completed = campaign.raters.filter((r) => r.status === "Completed");
  const averageRating = completed.length
    ? Math.round((completed.reduce((sum, r) => sum + (r.rating ?? 0), 0) / completed.length) * 10) / 10
    : null;
  return {
    id: campaign.id,
    cycleYear: campaign.cycleYear,
    closedAt: campaign.closedAt,
    responseCount: completed.length,
    averageRating,
    strengths: completed.map((r) => r.strengths).filter((s): s is string => !!s),
    developmentAreas: completed.map((r) => r.developmentAreas).filter((s): s is string => !!s),
  };
}
