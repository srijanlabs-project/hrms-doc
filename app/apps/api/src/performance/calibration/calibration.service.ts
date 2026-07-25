import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { AppraisalRepository } from "../appraisal/appraisal.repository";
import { CalibrationRepository } from "./calibration.repository";
import type { AdjustCalibrationCaseDto } from "./dto/adjust-case.dto";
import type { CreateCalibrationSessionDto } from "./dto/create-session.dto";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-CALIBRATION-001",
    code: "CALIBRATION-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-CALIBRATION-SESSION",
    details: { currentState },
  });
}

/**
 * v1 slice of 04-calibration.md: collapses cohort/distribution-snapshot
 * machinery into a session scoped by periodYear + a free-text cohortLabel
 * (optionally backed by a department filter). Draft -> InSession -> Closed;
 * "prepared"/"review-complete"/"approved"/"published" all fold into
 * InSession/Closed. Committee-only (org_admin/hr_ops) — no separate
 * participant-role model.
 */
@Injectable()
export class CalibrationService {
  constructor(
    private readonly repository: CalibrationRepository,
    private readonly appraisalRepository: AppraisalRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
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

  async create(dto: CreateCalibrationSessionDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, {
        periodYear: dto.periodYear,
        cohortLabel: dto.cohortLabel,
        createdByUserId: userId,
      });
    } catch {
      throw stateConflict("A calibration session for this period and cohort already exists.", "Duplicate");
    }
  }

  async generateCases(id: string, departmentId?: string) {
    const { tenantId } = this.requireAuthenticated();
    const session = await this.findOrThrow(tenantId, id);
    if (session.status !== "Draft") {
      throw stateConflict("Cases can only be generated while a session is in Draft.", session.status);
    }

    const eligible = await this.appraisalRepository.findEligibleForCalibration(
      tenantId,
      session.periodYear,
      departmentId,
    );
    if (eligible.length === 0) {
      throw new ValidationAppError([
        { field: "periodYear", code: "NO_ELIGIBLE_APPRAISALS", message: "No eligible finalized appraisals found for this period." },
      ]);
    }

    await this.repository.createCases(
      tenantId,
      eligible.map((appraisal) => ({
        sessionId: id,
        appraisalId: appraisal.id,
        employeeId: appraisal.employeeId,
        originalRating: appraisal.managerRating ?? 0,
      })),
    );
    return this.repository.updateStatus(tenantId, id, { status: "InSession" });
  }

  async adjustCase(caseId: string, dto: AdjustCalibrationCaseDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const calibrationCase = await this.findCaseOrThrow(tenantId, caseId);
    const session = await this.findOrThrow(tenantId, calibrationCase.sessionId);
    if (session.status !== "InSession") {
      throw stateConflict("Ratings can only be adjusted while the session is InSession.", session.status);
    }
    if (dto.calibratedRating !== calibrationCase.originalRating && !dto.rationale?.trim()) {
      throw new ValidationAppError([
        { field: "rationale", code: "RATIONALE_REQUIRED", message: "A rationale is required when changing the original rating." },
      ]);
    }

    return this.repository.updateCase(tenantId, caseId, {
      calibratedRating: dto.calibratedRating,
      rationale: dto.rationale,
      decidedByUserId: userId,
      decidedAt: new Date(),
    });
  }

  async closeSession(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const session = await this.findOrThrow(tenantId, id);
    if (session.status !== "InSession") {
      throw stateConflict("Only an InSession session can be closed.", session.status);
    }

    const cases = await this.repository.findCasesForSession(tenantId, id);
    for (const c of cases) {
      const finalRating = c.calibratedRating ?? c.originalRating;
      if (c.calibratedRating === null) {
        await this.repository.updateCase(tenantId, c.id, { calibratedRating: finalRating });
      }
      await this.appraisalRepository.applyCalibration(tenantId, c.appraisalId, {
        calibratedRating: finalRating,
        calibrationSessionId: id,
      });
    }

    await this.notifyEmployees(tenantId, cases.map((c) => c.employeeId));
    return this.repository.updateStatus(tenantId, id, { status: "Closed", closedByUserId: userId, closedAt: new Date() });
  }

  private async notifyEmployees(tenantId: string, employeeIds: string[]) {
    await Promise.all(
      employeeIds.map(async (employeeId) => {
        const user = await this.authRepository.findUserByEmployeeId(tenantId, employeeId);
        if (!user) return;
        await this.notificationService.notify(tenantId, user.id, {
          type: "calibration.rating.published",
          title: "Calibrated performance rating published",
          body: "Your calibrated appraisal rating for this cycle is now available.",
          linkPath: "/performance",
        });
      }),
    );
  }

  private async findOrThrow(tenantId: string, id: string) {
    const session = await this.repository.findById(tenantId, id);
    if (!session) {
      throw new NotFoundAppError("OBJ-CALIBRATION-SESSION", "Calibration session not found.");
    }
    return session;
  }

  private async findCaseOrThrow(tenantId: string, id: string) {
    const calibrationCase = await this.repository.findCaseById(tenantId, id);
    if (!calibrationCase) {
      throw new NotFoundAppError("OBJ-CALIBRATION-CASE", "Calibration case not found.");
    }
    return calibrationCase;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
