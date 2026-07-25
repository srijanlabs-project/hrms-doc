import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, ForbiddenAppError, ValidationAppError } from "../../platform/errors/errors";
import { prorateEntitlement, round2 } from "../prorate";
import { LeavePolicyRepository } from "../policy/leave-policy.repository";
import { LeaveRequestRepository } from "../request/leave-request.repository";
import type { CreateAdjustmentDto } from "./dto/create-adjustment.dto";
import { LeaveLedgerRepository } from "./leave-ledger.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * v1 slice of docs/08-submodule-specifications/08-leave-management/02-leave-accrual.md.
 * Deliberately additive, not a rebuild of LeaveBalanceService's live-computed
 * entitlement (see schema.prisma's LeaveLedgerEntry comment for why) — this
 * covers the two capabilities that genuinely didn't exist: audited manual
 * adjustments and year-end carry-forward, both now unblocked by the real
 * Scheduler/Audit engines built in the Foundation & Platform pass (the
 * original LeaveRequest schema comment cited "no queue infrastructure" as
 * the reason accrual stayed live-computed only — that blocker is gone for
 * these two capabilities specifically, though full periodic accrual posting
 * stays out of scope since the live prorate formula already produces the
 * same numbers correctly).
 */
@Injectable()
export class LeaveLedgerService {
  constructor(
    private readonly repository: LeaveLedgerRepository,
    private readonly policyRepository: LeavePolicyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly requestRepository: LeaveRequestRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async postAdjustment(dto: CreateAdjustmentDto) {
    const { tenantId, userId } = this.requireAuthenticated();

    const policy = await this.policyRepository.findByType(tenantId, dto.leaveType);
    if (!policy) {
      throw new ValidationAppError([
        { field: "leaveType", code: "NOT_FOUND", message: `No leave policy exists for type "${dto.leaveType}".` },
      ]);
    }
    const employee = await this.employeeRepository.findById(tenantId, dto.employeeId);
    if (!employee) {
      throw new ValidationAppError([{ field: "employeeId", code: "NOT_FOUND", message: "Employee not found." }]);
    }

    return this.repository.create(tenantId, {
      employeeId: dto.employeeId,
      leaveType: dto.leaveType,
      periodYear: dto.periodYear ?? new Date().getUTCFullYear(),
      entryType: "Adjustment",
      amountDays: dto.amountDays,
      reason: dto.reason,
      postedByUserId: userId,
    });
  }

  /**
   * For each Active employee and each leave policy with a positive
   * carryForwardCapDays, computes fromYear's unused balance (prorated
   * entitlement as of Dec 31 fromYear + that year's ledger adjustments -
   * that year's approved consumption), caps it at the policy's carry-forward
   * cap, and posts one CarryForward entry dated fromYear + 1. Idempotent —
   * skips any employee/leave-type pair that already has a CarryForward entry
   * for the target year.
   */
  async runCarryForward(fromYear: number) {
    const { tenantId, userId } = this.requireAuthenticated();
    const toYear = fromYear + 1;
    const yearEndOfFromYear = new Date(Date.UTC(fromYear, 11, 31, 23, 59, 59));
    const yearStartOfFromYear = new Date(Date.UTC(fromYear, 0, 1));

    const [employees, policies] = await Promise.all([
      this.employeeRepository.findAll(tenantId),
      this.policyRepository.findAll(tenantId),
    ]);
    const eligiblePolicies = policies.filter((p) => p.carryForwardCapDays > 0);
    const activeEmployees = employees.filter((e) => e.status === "Active");

    let posted = 0;
    let skippedExisting = 0;

    for (const employee of activeEmployees) {
      for (const policy of eligiblePolicies) {
        const existing = await this.repository.findExistingCarryForward(tenantId, employee.id, policy.leaveType, toYear);
        if (existing) {
          skippedExisting++;
          continue;
        }

        const prorated = prorateEntitlement(policy.annualDays, employee.joiningDate, yearEndOfFromYear);
        const consumedByType = await this.requestRepository.sumApprovedDaysByType(
          tenantId,
          employee.id,
          yearStartOfFromYear,
          yearEndOfFromYear,
        );
        const ledgerNet = await this.repository.sumForEmployeeYear(tenantId, employee.id, policy.leaveType, fromYear);
        const unused = round2(prorated + ledgerNet - (consumedByType[policy.leaveType] ?? 0));
        const carryAmount = Math.min(Math.max(unused, 0), policy.carryForwardCapDays);
        if (carryAmount <= 0) continue;

        await this.repository.create(tenantId, {
          employeeId: employee.id,
          leaveType: policy.leaveType,
          periodYear: toYear,
          entryType: "CarryForward",
          amountDays: carryAmount,
          reason: `Carried forward from ${fromYear}`,
          postedByUserId: userId,
        });
        posted++;
      }
    }

    return { fromYear, toYear, posted, skippedExisting };
  }

  async getLedger(employeeId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const isSelf = employeeId === employee.id;
    const isAdmin = this.requestContext.roles.some((role) => ADMIN_ROLES.includes(role));
    if (!isSelf && !isAdmin) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return this.repository.findForEmployee(tenantId, employeeId);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
