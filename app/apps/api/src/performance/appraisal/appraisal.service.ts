import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { AppraisalRepository } from "./appraisal.repository";
import type { AppraisalWithEmployee } from "./appraisal.repository";
import type { CreateAppraisalDto } from "./dto/create-appraisal.dto";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-APPRAISAL-001",
    code: "APPRAISAL-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-APPRAISAL",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/11-performance-management/02-appraisals.md:
 * self-review then manager-review then finalize, one overall rating (1-5)
 * per side. No skip-level review, no calibration, no disputes, no
 * configurable multi-section forms — see schema.prisma's Appraisal comment.
 */
@Injectable()
export class AppraisalService {
  constructor(
    private readonly repository: AppraisalRepository,
    private readonly authRepository: AuthRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateAppraisalDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, dto.employeeId, dto.periodYear);
    } catch {
      throw stateConflict(`An appraisal for this employee and period already exists.`, "Duplicate");
    }
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** Direct reports only — how a manager discovers appraisals waiting on their review. */
  async listTeam() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const reports = await this.employeeRepository.findByManagerId(tenantId, employee.id);
    if (reports.length === 0) return [];
    return this.repository.findForEmployees(
      tenantId,
      reports.map((r) => r.id),
    );
  }

  async submitSelfReview(id: string, rating: number, comments?: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const appraisal = await this.findOrThrow(tenantId, id);
    if (appraisal.employeeId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    if (appraisal.status !== "Draft") {
      throw stateConflict("Self-review can only be submitted while the appraisal is in Draft.", appraisal.status);
    }
    return this.repository.update(tenantId, id, {
      status: "SelfSubmitted",
      selfRating: rating,
      selfComments: comments,
      selfSubmittedAt: new Date(),
    });
  }

  async submitManagerReview(id: string, rating: number, comments?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const appraisal = await this.findOrThrow(tenantId, id);
    await this.requireManagerOrAdmin(tenantId, userId, appraisal);
    if (appraisal.status !== "SelfSubmitted") {
      throw stateConflict("Manager review requires the self-review to be submitted first.", appraisal.status);
    }
    return this.repository.update(tenantId, id, {
      status: "ManagerReviewed",
      managerRating: rating,
      managerComments: comments,
      managerSubmittedAt: new Date(),
    });
  }

  async finalize(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const appraisal = await this.findOrThrow(tenantId, id);
    await this.requireManagerOrAdmin(tenantId, userId, appraisal);
    if (appraisal.status !== "ManagerReviewed") {
      throw stateConflict("Only a Manager-Reviewed appraisal can be finalized.", appraisal.status);
    }
    return this.repository.update(tenantId, id, { status: "Finalized", finalizedAt: new Date() });
  }

  private async requireManagerOrAdmin(tenantId: string, userId: string, appraisal: AppraisalWithEmployee) {
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedManager = !!user?.employeeId && user.employeeId === appraisal.employee.managerId;
    const isAdminOverride = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isAssignedManager && !isAdminOverride) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
  }

  private async findOrThrow(tenantId: string, id: string) {
    const appraisal = await this.repository.findById(tenantId, id);
    if (!appraisal) {
      throw new NotFoundAppError("OBJ-APPRAISAL", "Appraisal not found.");
    }
    return appraisal;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
