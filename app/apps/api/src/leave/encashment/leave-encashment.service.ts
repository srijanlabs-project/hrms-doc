import { Injectable } from "@nestjs/common";
import { LeaveLedgerRepository } from "../ledger/leave-ledger.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { ArrearRepository } from "../../payroll/arrear/arrear.repository";
import { CompensationRepository } from "../../payroll/compensation/compensation.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { LeaveBalanceService } from "../balance/leave-balance.service";
import type { CreateEncashmentRequestDto } from "./dto/create-encashment-request.dto";
import type { RejectEncashmentRequestDto } from "./dto/reject-encashment-request.dto";
import { LeaveEncashmentRepository } from "./leave-encashment.repository";

const DAYS_PER_MONTH = 30;

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-LEAVE-ENCASHMENT-001",
    code: "LEAVE-ENCASHMENT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-LEAVE-ENCASHMENT-REQUEST",
    details: { currentState },
  });
}

/**
 * v1 slice closing Leave Management's "leave encashment" gap (E08) — while
 * still in service, distinct from the F&F-settlement encashment E09 already
 * built for exiting employees. Approval debits the leave balance via the
 * existing Leave Ledger (E08) — a signed Adjustment entry, same mechanism as
 * a manual adjustment or comp-off credit — and creates an ArrearEntry
 * (sourceType "LeaveEncashment") so the payout rides the existing
 * lump-sum-claimed-by-next-payroll-run mechanism, no parallel payout path.
 */
@Injectable()
export class LeaveEncashmentService {
  constructor(
    private readonly repository: LeaveEncashmentRepository,
    private readonly balanceService: LeaveBalanceService,
    private readonly ledgerRepository: LeaveLedgerRepository,
    private readonly arrearRepository: ArrearRepository,
    private readonly compensationRepository: CompensationRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateEncashmentRequestDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const available = await this.balanceService.getAvailable(tenantId, employee.id, employee.joiningDate, dto.leaveType);
    if (dto.days > available) {
      throw new ValidationAppError([
        { field: "days", code: "INSUFFICIENT_BALANCE", message: `Only ${available} day(s) of ${dto.leaveType} leave available.` },
      ]);
    }

    const compensation = await this.compensationRepository.findByEmployeeId(tenantId, employee.id);
    if (!compensation) {
      throw new ValidationAppError([
        { field: "days", code: "NO_COMPENSATION", message: "No compensation on file to compute an encashment rate from." },
      ]);
    }
    const ratePerDay = Math.round((compensation.monthlyBasic / DAYS_PER_MONTH) * 100) / 100;
    const amount = Math.round(ratePerDay * dto.days * 100) / 100;

    return this.repository.create(tenantId, {
      employeeId: employee.id,
      leaveType: dto.leaveType,
      days: dto.days,
      ratePerDay,
      amount,
      reason: dto.reason,
    });
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId, status);
  }

  async approve(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const request = await this.findOrThrow(tenantId, id);

    const count = await this.repository.decide(tenantId, id, { status: "Approved", decidedByUserId: userId });
    if (count === 0) {
      throw stateConflict("Only a Pending request can be approved.", request.status);
    }

    await this.ledgerRepository.create(tenantId, {
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      periodYear: new Date().getUTCFullYear(),
      entryType: "Adjustment",
      amountDays: -request.days,
      reason: `Encashed ${request.days} day(s) of ${request.leaveType} leave.`,
      postedByUserId: userId,
    });

    await this.arrearRepository.create(tenantId, {
      employeeId: request.employeeId,
      sourceType: "LeaveEncashment",
      sourceId: request.id,
      description: `Leave encashment: ${request.days} day(s) of ${request.leaveType} leave`,
      amount: request.amount,
      postedByUserId: userId,
    });

    return this.repository.findById(tenantId, id);
  }

  async reject(id: string, dto: RejectEncashmentRequestDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const request = await this.findOrThrow(tenantId, id);
    const count = await this.repository.decide(tenantId, id, {
      status: "Rejected",
      decisionNote: dto.decisionNote,
      decidedByUserId: userId,
    });
    if (count === 0) {
      throw stateConflict("Only a Pending request can be rejected.", request.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const request = await this.repository.findById(tenantId, id);
    if (!request) {
      throw new NotFoundAppError("OBJ-LEAVE-ENCASHMENT-REQUEST", "Encashment request not found.");
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
