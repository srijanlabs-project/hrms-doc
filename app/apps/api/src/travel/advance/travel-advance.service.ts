import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { TravelRequestRepository } from "../travel-request.repository";
import type { CreateTravelAdvanceDto } from "./dto/create-travel-advance.dto";
import { TravelAdvanceRepository } from "./travel-advance.repository";

type Decision = "Approved" | "Rejected";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-TRAVEL-ADVANCE-001",
    code: "TRAVEL-ADVANCE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-TRAVEL-ADVANCE",
    details: { currentState },
  });
}

/**
 * Wave 3 W4·E16 gap closure ("travel advances") — a cash-advance request
 * against a trip. No repayment schedule; reconciliation happens once at
 * settlement (see TravelSettlementService). Approval permission mirrors
 * TravelRequestService (assigned trip approver or org_admin/hr_ops override).
 */
@Injectable()
export class TravelAdvanceService {
  constructor(
    private readonly repository: TravelAdvanceRepository,
    private readonly travelRequestRepository: TravelRequestRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async request(travelRequestId: string, dto: CreateTravelAdvanceDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const travelRequest = await this.travelRequestRepository.findById(tenantId, travelRequestId);
    if (!travelRequest || travelRequest.employeeId !== employee.id) {
      throw new NotFoundAppError("OBJ-TRAVEL-REQUEST", "Travel request not found.");
    }

    const advance = await this.repository.create(tenantId, {
      travelRequestId,
      employeeId: employee.id,
      requestedAmount: dto.requestedAmount,
    });

    if (travelRequest.approverId) {
      const approverUser = await this.authRepository.findUserByEmployeeId(tenantId, travelRequest.approverId);
      if (approverUser) {
        await this.notificationService.notify(tenantId, approverUser.id, {
          type: "travel.advance.requested",
          title: "New travel advance request",
          body: `${employee.legalName} requested a ₹${dto.requestedAmount.toLocaleString("en-IN")} advance for their trip to ${travelRequest.destination}.`,
          linkPath: "/travel",
        });
      }
    }

    return advance;
  }

  async listForTravelRequest(travelRequestId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForTravelRequest(tenantId, travelRequestId);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAllAdmin(tenantId);
  }

  async decide(id: string, decision: Decision, approvedAmount?: number, note?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const advance = await this.findOrThrow(tenantId, id);
    const travelRequest = await this.travelRequestRepository.findById(tenantId, advance.travelRequestId);

    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedApprover = !!user?.employeeId && travelRequest?.approverId === user.employeeId;
    const isAdminOverride = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isAssignedApprover && !isAdminOverride) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    const count = await this.repository.decide(tenantId, id, {
      status: decision,
      approvedAmount: decision === "Approved" ? (approvedAmount ?? advance.requestedAmount) : undefined,
      decisionNote: note,
      decidedByUserId: userId,
    });
    if (count === 0) {
      throw stateConflict(`This advance is already ${advance.status.toLowerCase()}.`, advance.status);
    }

    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, advance.employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: `travel.advance.${decision.toLowerCase()}`,
        title: `Travel advance ${decision.toLowerCase()}`,
        body: `Your travel advance request was ${decision.toLowerCase()}.`,
        linkPath: "/travel",
      });
    }

    return this.repository.findById(tenantId, id);
  }

  /** Admin-only stand-in for the actual cash/bank disbursement step — no payment gateway in this build. */
  async disburse(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const advance = await this.findOrThrow(tenantId, id);
    const count = await this.repository.disburse(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only an Approved advance can be disbursed.", advance.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const advance = await this.repository.findById(tenantId, id);
    if (!advance) {
      throw new NotFoundAppError("OBJ-TRAVEL-ADVANCE", "Travel advance not found.");
    }
    return advance;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
