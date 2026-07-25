import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { LeaveLedgerRepository } from "../ledger/leave-ledger.repository";
import { LeavePolicyRepository } from "../policy/leave-policy.repository";
import { prorateEntitlement, round2 } from "../prorate";
import { LeaveRequestRepository } from "../request/leave-request.repository";

function currentYearWindow(now: Date): { yearStart: Date; yearEnd: Date } {
  return {
    yearStart: new Date(Date.UTC(now.getUTCFullYear(), 0, 1)),
    yearEnd: new Date(Date.UTC(now.getUTCFullYear(), 11, 31, 23, 59, 59)),
  };
}

@Injectable()
export class LeaveBalanceService {
  constructor(
    private readonly policyRepository: LeavePolicyRepository,
    private readonly requestRepository: LeaveRequestRepository,
    private readonly ledgerRepository: LeaveLedgerRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async getMyBalances() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const now = new Date();
    const { yearStart, yearEnd } = currentYearWindow(now);

    const [policies, consumedByType] = await Promise.all([
      this.policyRepository.findAll(tenantId),
      this.requestRepository.sumApprovedDaysByType(tenantId, employee.id, yearStart, yearEnd),
    ]);

    return Promise.all(
      policies.map(async (policy) => {
        const prorated = prorateEntitlement(policy.annualDays, employee.joiningDate, now);
        const consumed = consumedByType[policy.leaveType] ?? 0;
        const ledgerNet = await this.ledgerRepository.sumForEmployeeYear(
          tenantId,
          employee.id,
          policy.leaveType,
          now.getUTCFullYear(),
        );
        return {
          leaveType: policy.leaveType,
          name: policy.name,
          entitlement: policy.annualDays,
          prorated,
          consumed,
          ledgerNet,
          available: Math.max(0, round2(prorated + ledgerNet - consumed)),
        };
      }),
    );
  }

  /** Used by LeaveRequestService when validating a new request, avoiding a redundant "current employee" resolve. */
  async getAvailable(tenantId: string, employeeId: string, joiningDate: Date | null, leaveType: string): Promise<number> {
    const policy = await this.policyRepository.findByType(tenantId, leaveType);
    if (!policy) return 0;

    const now = new Date();
    const { yearStart, yearEnd } = currentYearWindow(now);
    const prorated = prorateEntitlement(policy.annualDays, joiningDate, now);
    const consumedByType = await this.requestRepository.sumApprovedDaysByType(tenantId, employeeId, yearStart, yearEnd);
    const consumed = consumedByType[leaveType] ?? 0;
    const ledgerNet = await this.ledgerRepository.sumForEmployeeYear(tenantId, employeeId, leaveType, now.getUTCFullYear());
    return Math.max(0, round2(prorated + ledgerNet - consumed));
  }
}
