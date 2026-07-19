import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { CurrentEmployeeService } from "../current-employee.service";
import { LeaveBalanceService } from "../balance/leave-balance.service";
import type { CreateLeaveRequestDto } from "./dto/create-leave-request.dto";
import { LeaveRequestRepository } from "./leave-request.repository";

type Decision = "Approved" | "Rejected";

@Injectable()
export class LeaveRequestService {
  constructor(
    private readonly repository: LeaveRequestRepository,
    private readonly balanceService: LeaveBalanceService,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateLeaveRequestDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) {
      throw new ValidationAppError([
        { field: "endDate", code: "BEFORE_START", message: "endDate must be on or after startDate." },
      ]);
    }
    const days = Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1;

    const available = await this.balanceService.getAvailable(
      tenantId,
      employee.id,
      employee.joiningDate,
      dto.leaveType,
    );
    if (days > available) {
      throw new ValidationAppError([
        {
          field: "leaveType",
          code: "INSUFFICIENT_BALANCE",
          message: `Only ${available} day(s) of ${dto.leaveType} leave available.`,
        },
      ]);
    }

    const { approverEmployeeId, approverUserId } = await this.resolveApprover(tenantId, employee.managerId);
    if (!approverEmployeeId) {
      throw new ValidationAppError([
        {
          field: "leaveType",
          code: "NO_APPROVER",
          message: "You do not have a manager configured to approve leave requests.",
        },
      ]);
    }

    const request = await this.repository.create(tenantId, {
      employeeId: employee.id,
      leaveType: dto.leaveType,
      startDate,
      endDate,
      days,
      reason: dto.reason,
      approverId: approverEmployeeId,
    });

    if (approverUserId) {
      await this.notificationService.notify(tenantId, approverUserId, {
        type: "leave.request.submitted",
        title: "New leave request",
        body: `${employee.legalName} requested ${days} day(s) of ${dto.leaveType} leave.`,
        linkPath: "/approvals",
      });
    }

    return request;
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async listForApproval(status?: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForApprover(tenantId, employee.id, status);
  }

  async decide(id: string, decision: Decision, note?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const request = await this.repository.findById(tenantId, id);
    if (!request) {
      throw new NotFoundAppError("OBJ-LEAVE-REQUEST", "Leave request not found.");
    }

    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedApprover = !!user?.employeeId && user.employeeId === request.approverId;
    const isAdminOverride = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isAssignedApprover && !isAdminOverride) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    if (request.status !== "Pending") {
      throw new AppError({
        errorRef: "ERR-LEAVE-002",
        code: "LEAVE-002",
        category: "state-conflict",
        severity: "medium",
        httpStatus: 409,
        message: `This request is already ${request.status.toLowerCase()}.`,
        retryable: false,
        tenantSafe: true,
        objectRef: "OBJ-LEAVE-REQUEST",
        details: { currentState: request.status },
      });
    }

    await this.repository.decide(tenantId, id, { status: decision, decisionNote: note, decidedByUserId: userId });

    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, request.employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: `leave.request.${decision.toLowerCase()}`,
        title: `Leave request ${decision.toLowerCase()}`,
        body: `Your ${request.leaveType} leave request (${request.days} day(s)) was ${decision.toLowerCase()}.`,
        linkPath: "/leave",
      });
    }

    return this.repository.findById(tenantId, id);
  }

  async cancel(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const count = await this.repository.cancel(tenantId, id, employee.id);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-LEAVE-REQUEST", "Request not found, not yours, or no longer pending.");
    }
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
