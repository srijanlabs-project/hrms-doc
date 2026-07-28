import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { ClosePipDto } from "./dto/close-pip.dto";
import type { CreatePipDto } from "./dto/create-pip.dto";
import { PipRepository } from "./pip.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-PIP-001",
    code: "PIP-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-PIP",
    details: { currentState },
  });
}

/**
 * W3·E11 gap closure — Performance Improvement Plan. org_admin/hr_ops can
 * create/manage a PIP for any employee; a manager only for their own direct
 * report (same ownership rule as TransferPromotionService.propose()). The
 * employee themselves gets a read-only view via listMine().
 */
@Injectable()
export class PipService {
  constructor(
    private readonly repository: PipRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreatePipDto) {
    const { tenantId, employee: actor, userId, roles } = await this.resolveActor();
    const target = await this.employeeRepository.findById(tenantId, dto.employeeId);
    if (!target) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    if (!this.isAdmin(roles) && target.managerId !== actor.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    const pip = await this.repository.create(tenantId, {
      employeeId: dto.employeeId,
      reason: dto.reason,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      createdByUserId: userId,
      objectiveTitles: dto.objectives,
    });

    const user = await this.authRepository.findUserByEmployeeId(tenantId, dto.employeeId);
    if (user) {
      await this.notificationService.notify(tenantId, user.id, {
        type: "performance.pip.created",
        title: "A Performance Improvement Plan has been created",
        body: `Reason: ${dto.reason}`,
        linkPath: "/performance/pip",
      });
    }

    return pip;
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async listTeam() {
    const { tenantId, employee: manager } = await this.currentEmployee.resolve();
    const reports = await this.employeeRepository.findByManagerId(tenantId, manager.id);
    return this.repository.findForEmployees(tenantId, reports.map((r) => r.id));
  }

  async listAllAdmin() {
    const { tenantId } = await this.resolveActor();
    return this.repository.findAllAdmin(tenantId);
  }

  async completeObjective(objectiveId: string) {
    const { tenantId, employee: actor, roles } = await this.resolveActor();
    const objective = await this.repository.findObjectiveById(tenantId, objectiveId);
    if (!objective) {
      throw new NotFoundAppError("OBJ-PIP-OBJECTIVE", "Objective not found.");
    }
    const pip = await this.findOrThrow(tenantId, objective.pipId);
    this.requireOwnership(pip, actor.id, roles);
    if (pip.status !== "Active") {
      throw stateConflict("Objectives can only be updated on an Active plan.", pip.status);
    }

    await this.repository.completeObjective(tenantId, objectiveId);
    return this.repository.findById(tenantId, pip.id);
  }

  async close(id: string, dto: ClosePipDto) {
    const { tenantId, employee: actor, userId, roles } = await this.resolveActor();
    const pip = await this.findOrThrow(tenantId, id);
    this.requireOwnership(pip, actor.id, roles);
    if (pip.status !== "Active") {
      throw stateConflict("Only an Active plan can be closed.", pip.status);
    }

    const closed = await this.repository.close(tenantId, id, {
      status: dto.outcome,
      outcomeNotes: dto.outcomeNotes,
      closedByUserId: userId,
      closedAt: new Date(),
    });

    const user = await this.authRepository.findUserByEmployeeId(tenantId, pip.employeeId);
    if (user) {
      await this.notificationService.notify(tenantId, user.id, {
        type: "performance.pip.closed",
        title: `Your Performance Improvement Plan was closed: ${dto.outcome}`,
        body: dto.outcomeNotes ?? "",
        linkPath: "/performance/pip",
      });
    }

    return closed;
  }

  private isAdmin(roles: string[]) {
    return roles.some((role) => ADMIN_ROLES.includes(role));
  }

  private requireOwnership(pip: { employee: { managerId: string | null } }, actorEmployeeId: string, roles: string[]) {
    if (!this.isAdmin(roles) && pip.employee.managerId !== actorEmployeeId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
  }

  private async findOrThrow(tenantId: string, id: string) {
    const pip = await this.repository.findById(tenantId, id);
    if (!pip) {
      throw new NotFoundAppError("OBJ-PIP", "Performance Improvement Plan not found.");
    }
    return pip;
  }

  private async resolveActor() {
    const { tenantId, employee, userId } = await this.currentEmployee.resolve();
    return { tenantId, employee, userId, roles: this.requestContext.roles };
  }
}
