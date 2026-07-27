import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateSafetyIncidentDto } from "./dto/create-safety-incident.dto";
import type { ReviewSafetyIncidentDto } from "./dto/review-safety-incident.dto";
import { SafetyIncidentRepository } from "./safety-incident.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-SAFETY-INCIDENT-001",
    code: "SAFETY-INCIDENT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-SAFETY-INCIDENT",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/03-module-specifications/22-health-safety-wellness.md.
 * State machine collapsed 5→4 (see schema.prisma's SafetyIncident comment):
 * spec's ActionAssigned folds into UnderReview's investigationNotes field —
 * there's no separate assignee/task entity to justify a distinct state.
 * Any employee can report; review/resolve/close are org_admin/hr_ops only
 * (see controller's @Roles guard).
 */
@Injectable()
export class SafetyIncidentService {
  constructor(
    private readonly repository: SafetyIncidentRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateSafetyIncidentDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.create(tenantId, {
      reportedByEmployeeId: employee.id,
      incidentDate: new Date(dto.incidentDate),
      location: dto.location,
      description: dto.description,
      severity: dto.severity ?? "Medium",
    });
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForReporter(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId, status);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async review(id: string, dto: ReviewSafetyIncidentDto) {
    const { tenantId } = this.requireAuthenticated();
    const incident = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Reported", "UnderReview"], {
      status: "UnderReview",
      investigationNotes: dto.investigationNotes,
    });
    if (count === 0) {
      throw stateConflict("Only a Reported or UnderReview incident can be updated with investigation notes.", incident.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async resolve(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const incident = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["UnderReview"], {
      status: "Resolved",
      resolvedAt: new Date(),
    });
    if (count === 0) {
      throw stateConflict("Only an UnderReview incident can be resolved.", incident.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async close(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const incident = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Resolved"], {
      status: "Closed",
      closedAt: new Date(),
    });
    if (count === 0) {
      throw stateConflict("Only a Resolved incident can be closed.", incident.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const incident = await this.repository.findById(tenantId, id);
    if (!incident) {
      throw new NotFoundAppError("OBJ-SAFETY-INCIDENT", "Safety incident not found.");
    }
    return incident;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
