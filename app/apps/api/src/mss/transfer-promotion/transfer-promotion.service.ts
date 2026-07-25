import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { CareerRepository } from "../../people/career/career.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateTransferPromotionRequestDto } from "./dto/create-request.dto";
import type { RejectTransferPromotionRequestDto } from "./dto/reject-request.dto";
import { TransferPromotionRepository } from "./transfer-promotion.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-TRANSFER-PROMOTION-001",
    code: "TRANSFER-PROMOTION-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-TRANSFER-PROMOTION-REQUEST",
    details: { currentState },
  });
}

/**
 * v1 slice closing Manager Self Service's "transfers and promotions" gap.
 * Mirrors SalaryRevision's exact Proposed/Approved/Applied/Rejected state
 * machine. Apply() writes through CareerRepository.createAssignmentHistory +
 * EmployeeRepository.applyAssignmentChange — the same mechanism the
 * existing admin-only "record a movement" flow uses — rather than a
 * parallel history/apply path.
 */
@Injectable()
export class TransferPromotionService {
  constructor(
    private readonly repository: TransferPromotionRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly careerRepository: CareerRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  /** Manager only, and only for their own direct report. */
  async propose(dto: CreateTransferPromotionRequestDto) {
    const { tenantId, employee: manager, userId } = await this.currentEmployee.resolve();
    const target = await this.employeeRepository.findById(tenantId, dto.employeeId);
    if (!target) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    if (target.managerId !== manager.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    const request = await this.repository.create(tenantId, {
      employeeId: dto.employeeId,
      requestedByUserId: userId,
      changeType: dto.changeType,
      toDepartmentId: dto.toDepartmentId,
      toDesignationId: dto.toDesignationId,
      toGradeId: dto.toGradeId,
      effectiveDate: new Date(dto.effectiveDate),
      reason: dto.reason,
    });

    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    await Promise.all(
      admins.map((admin) =>
        this.notificationService.notify(tenantId, admin.id, {
          type: "mss.transfer-promotion.requested",
          title: `${dto.changeType} request submitted`,
          body: `${manager.legalName} proposed a ${dto.changeType.toLowerCase()} for ${target.legalName}.`,
          linkPath: "/team",
        }),
      ),
    );

    return request;
  }

  async listMine() {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.findByRequester(tenantId, userId);
  }

  /** org_admin/hr_ops only. */
  async listAllAdmin(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAllAdmin(tenantId, status);
  }

  async approve(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const request = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Proposed"], {
      status: "Approved",
      decidedByUserId: userId,
    });
    if (count === 0) {
      throw stateConflict("Only a Proposed request can be approved.", request.status);
    }
    await this.notifyRequester(tenantId, request, "approved", "Your transfer/promotion request was approved.");
    return this.repository.findById(tenantId, id);
  }

  async reject(id: string, dto: RejectTransferPromotionRequestDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const request = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Proposed"], {
      status: "Rejected",
      decidedByUserId: userId,
      decisionNote: dto.decisionNote,
    });
    if (count === 0) {
      throw stateConflict("Only a Proposed request can be rejected.", request.status);
    }
    await this.notifyRequester(tenantId, request, "rejected", `Your transfer/promotion request was rejected: ${dto.decisionNote}`);
    return this.repository.findById(tenantId, id);
  }

  async apply(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const request = await this.findOrThrow(tenantId, id);
    if (request.status !== "Approved") {
      throw stateConflict("Only an Approved request can be applied.", request.status);
    }

    const target = await this.employeeRepository.findById(tenantId, request.employeeId);
    if (!target) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }

    await this.careerRepository.createAssignmentHistory(tenantId, {
      employeeId: request.employeeId,
      changeType: request.changeType,
      effectiveDate: request.effectiveDate,
      fromDepartmentId: target.departmentId,
      toDepartmentId: request.toDepartmentId ?? target.departmentId,
      fromManagerId: target.managerId,
      toManagerId: target.managerId,
      fromDesignationId: target.designationId,
      toDesignationId: request.toDesignationId ?? target.designationId,
      fromGradeId: target.gradeId,
      toGradeId: request.toGradeId ?? target.gradeId,
      reason: request.reason,
      createdByUserId: request.decidedByUserId,
    });

    await this.employeeRepository.applyAssignmentChange(tenantId, request.employeeId, {
      departmentId: request.toDepartmentId ?? target.departmentId ?? undefined,
      managerId: target.managerId ?? undefined,
      designationId: request.toDesignationId ?? target.designationId ?? undefined,
      gradeId: request.toGradeId ?? target.gradeId ?? undefined,
    });

    const count = await this.repository.transition(tenantId, id, ["Approved"], {
      status: "Applied",
      appliedAt: new Date(),
    });
    if (count === 0) {
      throw stateConflict("This request was already applied.", "Applied");
    }
    return this.repository.findById(tenantId, id);
  }

  private async notifyRequester(tenantId: string, request: { requestedByUserId: string }, outcome: string, body: string) {
    await this.notificationService.notify(tenantId, request.requestedByUserId, {
      type: `mss.transfer-promotion.${outcome}`,
      title: `Transfer/promotion request ${outcome}`,
      body,
      linkPath: "/team",
    });
  }

  private async findOrThrow(tenantId: string, id: string) {
    const request = await this.repository.findById(tenantId, id);
    if (!request) {
      throw new NotFoundAppError("OBJ-TRANSFER-PROMOTION-REQUEST", "Request not found.");
    }
    return request;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
