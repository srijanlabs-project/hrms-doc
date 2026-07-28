import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { CareerPlanRepository } from "./career-plan.repository";
import type { CreateCareerPlanDto } from "./dto/create-career-plan.dto";
import type { UpdateCareerPlanStatusDto } from "./dto/update-career-plan-status.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-CAREER-PLAN-001",
    code: "CAREER-PLAN-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-CAREER-PLAN",
    details: { currentState },
  });
}

/**
 * Wave 3 E13 gap closure ("career planning") — self-service by default,
 * unlike PIP: the employee creates and drives their own plan; their manager
 * and org_admin/hr_ops get read access plus the ability to add supporting
 * actions and change status, not to create the plan itself.
 */
@Injectable()
export class CareerPlanService {
  constructor(
    private readonly repository: CareerPlanRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async createMine(dto: CreateCareerPlanDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.create(tenantId, {
      employeeId: employee.id,
      targetDesignationId: dto.targetDesignationId,
      timeframeYears: dto.timeframeYears,
      developmentNotes: dto.developmentNotes,
      actionTitles: dto.actions ?? [],
    });
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

  async addAction(planId: string, title: string) {
    const { tenantId, employee: actor, roles } = await this.resolveActor();
    const plan = await this.findOrThrow(tenantId, planId);
    this.requireAccess(plan, actor.id, roles);
    await this.repository.addAction(tenantId, planId, title);
    return this.repository.findById(tenantId, planId);
  }

  async completeAction(actionId: string) {
    const { tenantId, employee: actor, roles } = await this.resolveActor();
    const action = await this.repository.findActionById(tenantId, actionId);
    if (!action) {
      throw new NotFoundAppError("OBJ-CAREER-PLAN-ACTION", "Action not found.");
    }
    const plan = await this.findOrThrow(tenantId, action.planId);
    this.requireAccess(plan, actor.id, roles);

    await this.repository.completeAction(tenantId, actionId);
    return this.repository.findById(tenantId, plan.id);
  }

  async updateStatus(planId: string, dto: UpdateCareerPlanStatusDto) {
    const { tenantId, employee: actor, roles } = await this.resolveActor();
    const plan = await this.findOrThrow(tenantId, planId);
    this.requireAccess(plan, actor.id, roles);
    if (plan.status !== "Draft" && plan.status !== "Active") {
      throw stateConflict("Only a Draft or Active plan can change status.", plan.status);
    }
    return this.repository.updateStatus(tenantId, planId, dto.status);
  }

  private isAdmin(roles: string[]) {
    return roles.some((role) => ADMIN_ROLES.includes(role));
  }

  private requireAccess(plan: { employeeId: string; employee: { managerId: string | null } }, actorEmployeeId: string, roles: string[]) {
    const isOwner = plan.employeeId === actorEmployeeId;
    const isManagerOfOwner = plan.employee.managerId === actorEmployeeId;
    if (!isOwner && !isManagerOfOwner && !this.isAdmin(roles)) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
  }

  private async findOrThrow(tenantId: string, id: string) {
    const plan = await this.repository.findById(tenantId, id);
    if (!plan) {
      throw new NotFoundAppError("OBJ-CAREER-PLAN", "Career plan not found.");
    }
    return plan;
  }

  private async resolveActor() {
    const { tenantId, employee, userId } = await this.currentEmployee.resolve();
    return { tenantId, employee, userId, roles: this.requestContext.roles };
  }
}
