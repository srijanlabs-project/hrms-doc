import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError } from "../platform/errors/errors";
import { TalentAssessmentRepository } from "./talent-assessment.repository";
import type { UpsertTalentAssessmentDto } from "./dto/upsert-talent-assessment.dto";

/**
 * v1 slice of docs/08-submodule-specifications/13-talent-management/02-talent-reviews.md:
 * a single directly-editable 9-box placement per employee per period, entered
 * by org_admin/hr_ops — no review cycles, calibration sessions/history,
 * action tracking, or confidential-note segmentation. See schema.prisma's
 * TalentAssessment comment for the full list of collapsed spec features.
 */
@Injectable()
export class TalentAssessmentService {
  constructor(
    private readonly repository: TalentAssessmentRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async upsert(dto: UpsertTalentAssessmentDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.upsert(tenantId, dto.employeeId, dto.periodYear, {
      performanceRating: dto.performanceRating,
      potentialRating: dto.potentialRating,
      notes: dto.notes,
    });
  }

  async listForPeriod(periodYear: number) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForPeriod(tenantId, periodYear);
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
