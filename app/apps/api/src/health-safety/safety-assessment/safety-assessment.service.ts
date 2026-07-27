import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CompleteSafetyAssessmentDto } from "./dto/complete-safety-assessment.dto";
import type { CreateSafetyAssessmentDto } from "./dto/create-safety-assessment.dto";
import { SafetyAssessmentRepository } from "./safety-assessment.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-SAFETY-ASSESSMENT-001",
    code: "SAFETY-ASSESSMENT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-SAFETY-ASSESSMENT",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/03-module-specifications/22-health-safety-wellness.md.
 * Collapses audits, risk assessments, and drills (Audit|RiskAssessment|Drill)
 * into one type-tagged entity — see schema.prisma's SafetyAssessment comment.
 * Admin-only end to end (org_admin/hr_ops), see controller's @Roles guard —
 * there's no self-service angle for scheduling or completing a workplace
 * safety assessment.
 */
@Injectable()
export class SafetyAssessmentService {
  constructor(
    private readonly repository: SafetyAssessmentRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateSafetyAssessmentDto) {
    const { tenantId } = await this.currentEmployee.resolve();
    return this.repository.create(tenantId, {
      type: dto.type,
      location: dto.location,
      assessedDate: new Date(dto.assessedDate),
      conductedByEmployeeId: dto.conductedByEmployeeId,
    });
  }

  async listAll(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId, status);
  }

  async complete(id: string, dto: CompleteSafetyAssessmentDto) {
    const { tenantId } = this.requireAuthenticated();
    const assessment = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Scheduled"], {
      status: "Completed",
      findings: dto.findings,
      riskLevel: dto.riskLevel,
    });
    if (count === 0) {
      throw stateConflict("Only a Scheduled assessment can be completed.", assessment.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const assessment = await this.repository.findById(tenantId, id);
    if (!assessment) {
      throw new NotFoundAppError("OBJ-SAFETY-ASSESSMENT", "Safety assessment not found.");
    }
    return assessment;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
