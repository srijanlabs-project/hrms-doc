import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../auth/auth.repository";
import { DelegationService } from "../auth/delegation/delegation.service";
import { NotificationService } from "../notifications/notification.service";
import { CurrentEmployeeService } from "../people/current-employee.service";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { RequestContextService } from "../platform/context/request-context.service";
import { AppError } from "../platform/errors/app-error";
import {
  AuthenticationAppError,
  ForbiddenAppError,
  NotFoundAppError,
} from "../platform/errors/errors";
import { TravelRequestRepository } from "./travel-request.repository";
import type { CreateTravelRequestDto } from "./dto/create-travel-request.dto";

type Decision = "Approved" | "Rejected";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-TRAVEL-001",
    code: "TRAVEL-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-TRAVEL-REQUEST",
    details: { currentState },
  });
}

/**
 * v1 slice — see schema.prisma's TravelRequest comment for the full list of
 * collapsed spec features. Approval permission pattern mirrors
 * LeaveRequestService/ExpenseClaimService exactly (assigned manager or
 * org_admin/hr_ops override).
 */
@Injectable()
export class TravelRequestService {
  constructor(
    private readonly repository: TravelRequestRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly delegationService: DelegationService,
  ) {}

  async create(dto: CreateTravelRequestDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) {
      throw stateConflict("End date cannot be before start date.", "Invalid");
    }

    const { approverEmployeeId, approverUserId } = await this.resolveApprover(tenantId, employee.managerId);

    const request = await this.repository.create(tenantId, {
      employeeId: employee.id,
      tripType: dto.tripType,
      origin: dto.origin,
      destination: dto.destination,
      startDate,
      endDate,
      estimatedCost: dto.estimatedCost,
      purpose: dto.purpose,
      approverId: approverEmployeeId,
    });

    if (approverUserId) {
      await this.notificationService.notify(tenantId, approverUserId, {
        type: "travel.request.submitted",
        title: "New travel request",
        body: `${employee.legalName} requested ${dto.tripType} travel to ${dto.destination}.`,
        linkPath: "/travel",
      });
    }

    return request;
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async listForApproval() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForApprover(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async decide(id: string, decision: Decision, note?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const request = await this.repository.findById(tenantId, id);
    if (!request) {
      throw new NotFoundAppError("OBJ-TRAVEL-REQUEST", "Travel request not found.");
    }

    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedApprover = !!user?.employeeId && user.employeeId === request.approverId;
    const isAdminOverride = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    let isDelegatedApprover = false;
    if (!isAssignedApprover && !isAdminOverride && request.approverId) {
      const approverUser = await this.authRepository.findUserByEmployeeId(tenantId, request.approverId);
      isDelegatedApprover = !!approverUser && (await this.delegationService.isDelegated(tenantId, userId, approverUser.id, "TravelApproval"));
    }
    if (!isAssignedApprover && !isAdminOverride && !isDelegatedApprover) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    if (request.status !== "Pending") {
      throw stateConflict(`This request is already ${request.status.toLowerCase()}.`, request.status);
    }

    await this.repository.decide(tenantId, id, { status: decision, decisionNote: note, decidedByUserId: userId });

    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, request.employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: `travel.request.${decision.toLowerCase()}`,
        title: `Travel request ${decision.toLowerCase()}`,
        body: `Your ${request.tripType} trip to ${request.destination} was ${decision.toLowerCase()}.`,
        linkPath: "/travel",
      });
    }

    return this.repository.findById(tenantId, id);
  }

  async cancel(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const count = await this.repository.cancel(tenantId, id, employee.id);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-TRAVEL-REQUEST", "Request not found, not yours, or no longer pending.");
    }
  }

  /** Admin-only stand-in for the whole booking/travel-desk downstream flow — see schema.prisma's TravelRequest comment. */
  async markCompleted(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const request = await this.repository.findById(tenantId, id);
    if (!request) {
      throw new NotFoundAppError("OBJ-TRAVEL-REQUEST", "Travel request not found.");
    }
    const count = await this.repository.markCompleted(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only an Approved request can be marked as completed.", request.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private async resolveApprover(tenantId: string, managerId: string | null) {
    if (!managerId) return { approverEmployeeId: undefined, approverUserId: undefined };
    const manager = await this.employeeRepository.findById(tenantId, managerId);
    if (!manager) return { approverEmployeeId: undefined, approverUserId: undefined };
    const managerUser = await this.authRepository.findUserByEmployeeId(tenantId, manager.id);
    return { approverEmployeeId: manager.id, approverUserId: managerUser?.id };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
