import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { round2 } from "../calc/payroll-calculator";
import type { CreateLoanAdvanceRequestDto } from "./dto/create-loan-advance-request.dto";
import type { RejectLoanAdvanceRequestDto } from "./dto/reject-loan-advance-request.dto";
import { LoanAdvanceRepository } from "./loan-advance.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-LOAN-ADVANCE-001",
    code: "LOAN-ADVANCE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-LOAN-ADVANCE",
    details: { currentState },
  });
}

/**
 * v1 slice closing Payroll's "loans and advances" gap (E09). Flat-installment
 * repayment, no interest. Approving disburses in one step (status Active,
 * outstandingBalance = principal) — see PayrollRunService for the
 * process()-reads/approve()-commits installment mechanism.
 */
@Injectable()
export class LoanAdvanceService {
  constructor(
    private readonly repository: LoanAdvanceRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateLoanAdvanceRequestDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.create(tenantId, {
      employeeId: employee.id,
      type: dto.type,
      principal: dto.principal,
      monthlyInstallment: dto.monthlyInstallment,
      outstandingBalance: 0,
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
    const count = await this.repository.decide(tenantId, id, {
      status: "Active",
      outstandingBalance: round2(request.principal),
      decidedByUserId: userId,
    });
    if (count === 0) {
      throw stateConflict("Only a Requested loan/advance can be approved.", request.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async reject(id: string, dto: RejectLoanAdvanceRequestDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const request = await this.findOrThrow(tenantId, id);
    const count = await this.repository.decide(tenantId, id, {
      status: "Rejected",
      decisionNote: dto.decisionNote,
      decidedByUserId: userId,
    });
    if (count === 0) {
      throw stateConflict("Only a Requested loan/advance can be rejected.", request.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const request = await this.repository.findById(tenantId, id);
    if (!request) {
      throw new NotFoundAppError("OBJ-LOAN-ADVANCE", "Loan/advance request not found.");
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
