import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { CurrentEmployeeService } from "../people/current-employee.service";
import { RequestContextService } from "../platform/context/request-context.service";
import { AppError } from "../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../platform/errors/errors";
import { OnboardingCaseRepository } from "./onboarding-case.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-ONBOARDING-001",
    code: "ONBOARDING-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ONBOARDING-CASE",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/02-people-management/09-onboarding.md:
 * fixed checklist (see onboarding-tasks.const.ts), no document upload/review
 * sub-workflow — a task is completed or waived directly, not
 * submitted/approved/rejected. Activation blocks only on isBlocking tasks
 * still NotStarted; it flips both the case and the linked Employee to
 * Active in one action (no separate "Ready for Join Date" gating window).
 */
@Injectable()
export class OnboardingService {
  constructor(
    private readonly repository: OnboardingCaseRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async getMyCase() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const onboardingCase = await this.repository.findByEmployeeId(tenantId, employee.id);
    if (!onboardingCase) {
      throw new NotFoundAppError("OBJ-ONBOARDING-CASE", "You do not have an onboarding case.");
    }
    return onboardingCase;
  }

  async completeMyTask(taskId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const onboardingCase = await this.repository.findByEmployeeId(tenantId, employee.id);
    if (!onboardingCase) {
      throw new NotFoundAppError("OBJ-ONBOARDING-CASE", "You do not have an onboarding case.");
    }
    const task = onboardingCase.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new NotFoundAppError("OBJ-ONBOARDING-TASK", "Task not found on your onboarding case.");
    }
    if (task.status !== "NotStarted") {
      throw stateConflict("This task is already completed or waived.", task.status);
    }
    return this.repository.updateTaskStatus(tenantId, taskId, { status: "Completed", completedAt: new Date() });
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async getById(id: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.findOrThrow(tenantId, id);
  }

  async waiveTask(taskId: string) {
    const { tenantId } = this.requireAuthenticated();
    const task = await this.repository.findTaskById(tenantId, taskId);
    if (!task) {
      throw new NotFoundAppError("OBJ-ONBOARDING-TASK", "Task not found.");
    }
    if (task.status !== "NotStarted") {
      throw stateConflict("This task is already completed or waived.", task.status);
    }
    return this.repository.updateTaskStatus(tenantId, taskId, { status: "Waived" });
  }

  async activate(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const onboardingCase = await this.findOrThrow(tenantId, id);
    if (onboardingCase.status === "Activated") {
      throw stateConflict("This case is already activated.", onboardingCase.status);
    }
    const openBlockingTasks = onboardingCase.tasks.filter((t) => t.isBlocking && t.status === "NotStarted");
    if (openBlockingTasks.length > 0) {
      throw stateConflict(
        `${openBlockingTasks.length} blocking task(s) are still incomplete.`,
        "Blocked",
      );
    }

    await this.employeeRepository.updateStatus(tenantId, onboardingCase.employeeId, "Active");
    return this.repository.updateStatus(tenantId, id, { status: "Activated", activatedAt: new Date() });
  }

  private async findOrThrow(tenantId: string, id: string) {
    const onboardingCase = await this.repository.findById(tenantId, id);
    if (!onboardingCase) {
      throw new NotFoundAppError("OBJ-ONBOARDING-CASE", "Onboarding case not found.");
    }
    return onboardingCase;
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
