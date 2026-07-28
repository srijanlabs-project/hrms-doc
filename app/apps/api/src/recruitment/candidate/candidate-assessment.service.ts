import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import { CandidateAssessmentRepository } from "./candidate-assessment.repository";
import type { CreateAssessmentDto } from "./dto/create-assessment.dto";

/**
 * W3·E06 Recruitment and ATS gap closure — pre-hire candidate assessments.
 * A distinct concept from employee-facing performance/competency
 * assessments (E11/E13): administered during the recruitment pipeline,
 * before conversion, and can exist against a candidate directly (talent
 * pool) or a specific application.
 */
@Injectable()
export class CandidateAssessmentService {
  constructor(
    private readonly repository: CandidateAssessmentRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(candidateId: string, dto: CreateAssessmentDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      candidateId,
      applicationId: dto.applicationId,
      type: dto.type,
      score: dto.score,
      maxScore: dto.maxScore,
      notes: dto.notes,
      administeredByUserId: userId,
    });
  }

  async listForCandidate(candidateId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForCandidate(tenantId, candidateId);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
