import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError } from "../../platform/errors/errors";
import type { CreateGoalDto } from "./dto/create-goal.dto";
import { GoalRepository } from "./goal.repository";

const TERMINAL_STATUSES = ["Completed", "Closed"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-GOAL-001",
    code: "GOAL-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-GOAL",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/11-performance-management/01-goal-management.md:
 * employee self-creates goals directly into Active status (no draft/submit/
 * approve step, no cascading from enterprise/department goals, no shared
 * goals or milestones). Progress is a single updatable percentage + note,
 * not a persisted check-in history.
 */
@Injectable()
export class GoalService {
  constructor(
    private readonly repository: GoalRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async create(dto: CreateGoalDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.create(tenantId, {
      employeeId: employee.id,
      periodYear: dto.periodYear,
      title: dto.title,
      description: dto.description,
      weight: dto.weight,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      status: "Active",
    });
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async listTeam() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const reports = await this.employeeRepository.findByManagerId(tenantId, employee.id);
    if (reports.length === 0) return [];
    return this.repository.findForEmployees(
      tenantId,
      reports.map((r) => r.id),
    );
  }

  async updateProgress(id: string, progress: number, note?: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const goal = await this.findOwnedOrThrow(tenantId, employee.id, id);
    if (TERMINAL_STATUSES.includes(goal.status)) {
      throw stateConflict("This goal is already completed or closed.", goal.status);
    }
    if (goal.keyResults.length > 0) {
      throw stateConflict("This goal's progress is computed from its key results — update a key result instead.", goal.status);
    }
    return this.repository.updateProgress(tenantId, id, { progress, progressNote: note });
  }

  async complete(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const goal = await this.findOwnedOrThrow(tenantId, employee.id, id);
    if (goal.status !== "Active") {
      throw stateConflict("Only Active goals can be marked complete.", goal.status);
    }
    return this.repository.updateStatus(tenantId, id, "Completed");
  }

  /** Used by KeyResultService to verify ownership before adding/updating a key result. */
  async getOwned(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.findOwnedOrThrow(tenantId, employee.id, id);
  }

  private async findOwnedOrThrow(tenantId: string, employeeId: string, id: string) {
    const goal = await this.repository.findById(tenantId, id);
    if (!goal || goal.employeeId !== employeeId) {
      throw new NotFoundAppError("OBJ-GOAL", "Goal not found.");
    }
    return goal;
  }
}
