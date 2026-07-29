import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { AssignGrievanceHandlerDto } from "./dto/assign-grievance-handler.dto";
import type { SubmitGrievanceCaseDto } from "./dto/submit-grievance-case.dto";
import { GrievanceRepository } from "./grievance.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-GRIEVANCE-001",
    code: "GRIEVANCE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-GRIEVANCE-CASE",
    details: { currentState },
  });
}

/**
 * Wave 4·E19 gap closure ("employee relations and grievance management").
 * Deliberately a separate model and access path from Ticket — no general
 * helpdesk agent pool ever sees these, only org_admin/hr_ops and the filing
 * employee themselves. Admin-facing notifications never include the
 * subject/description to preserve confidentiality until someone actually
 * opens the case detail view.
 */
@Injectable()
export class GrievanceService {
  constructor(
    private readonly repository: GrievanceRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async submit(dto: SubmitGrievanceCaseDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const grievanceCase = await this.repository.create(tenantId, {
      employeeId: employee.id,
      caseType: dto.caseType,
      subject: dto.subject,
      description: dto.description,
    });

    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    await Promise.all(
      admins.map((admin) =>
        this.notificationService.notify(tenantId, admin.id, {
          type: "helpdesk.grievance.submitted",
          title: "New employee relations case submitted",
          body: "A new confidential case has been submitted and needs a handler assigned.",
          linkPath: "/helpdesk",
        }),
      ),
    );

    return grievanceCase;
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async getById(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const grievanceCase = await this.findOrThrow(tenantId, id);
    const isAdmin = await this.isAdminCaller(tenantId, userId);
    const employeeId = await this.currentEmployeeIdOrNull(tenantId, userId);
    if (!isAdmin && grievanceCase.employeeId !== employeeId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return grievanceCase;
  }

  /** org_admin/hr_ops only. */
  async assignHandler(id: string, dto: AssignGrievanceHandlerDto) {
    const { tenantId } = this.requireAuthenticated();
    const grievanceCase = await this.findOrThrow(tenantId, id);
    const count = await this.repository.assignHandler(tenantId, id, dto.handlerEmployeeId);
    if (count === 0) {
      throw stateConflict("Only a Received case can have a handler assigned.", grievanceCase.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** org_admin/hr_ops only. */
  async resolve(id: string, resolutionSummary: string) {
    const { tenantId } = this.requireAuthenticated();
    const grievanceCase = await this.findOrThrow(tenantId, id);
    const count = await this.repository.resolve(tenantId, id, resolutionSummary);
    if (count === 0) {
      throw stateConflict("Only a Received or UnderInvestigation case can be resolved.", grievanceCase.status);
    }

    const raiserUser = await this.authRepository.findUserByEmployeeId(tenantId, grievanceCase.employeeId);
    if (raiserUser) {
      await this.notificationService.notify(tenantId, raiserUser.id, {
        type: "helpdesk.grievance.resolved",
        title: "Your case has been resolved",
        body: "Your confidential case has been resolved. Contact HR for details.",
        linkPath: "/helpdesk",
      });
    }
    return this.repository.findById(tenantId, id);
  }

  /** org_admin/hr_ops only. */
  async close(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const grievanceCase = await this.findOrThrow(tenantId, id);
    const count = await this.repository.close(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only a Resolved case can be closed.", grievanceCase.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const grievanceCase = await this.repository.findById(tenantId, id);
    if (!grievanceCase) {
      throw new NotFoundAppError("OBJ-GRIEVANCE-CASE", "Case not found.");
    }
    return grievanceCase;
  }

  private async isAdminCaller(tenantId: string, userId: string): Promise<boolean> {
    const user = await this.authRepository.findUserById(tenantId, userId);
    return !!user?.roles.some((role) => ADMIN_ROLES.includes(role));
  }

  private async currentEmployeeIdOrNull(tenantId: string, userId: string): Promise<string | null> {
    const user = await this.authRepository.findUserById(tenantId, userId);
    return user?.employeeId ?? null;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
