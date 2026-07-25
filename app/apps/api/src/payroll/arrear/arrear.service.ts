import { Injectable } from "@nestjs/common";
import type { ArrearEntry, SalaryRevision } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import { HRA_RATE, round2 } from "../calc/payroll-calculator";
import { PayrollRunRepository } from "../run/payroll-run.repository";
import { ArrearRepository } from "./arrear.repository";

/**
 * v1 slice of docs/08-submodule-specifications/09-payroll/04-arrears-and-retro-pay.md.
 * One lump-sum entry per trigger — no period-by-period delta breakdown, no
 * statutory recomputation of historical periods, no difference-only vs
 * full-rebuild mode. Approximates gross impact as
 * (proposedBasic - previousBasic) x (1 + HRA_RATE), matching how the payroll
 * calculator itself derives gross from Basic, multiplied by however many
 * already-Processed/Approved/Closed periods the employee was actually paid
 * in since the revision's effective month.
 */
@Injectable()
export class ArrearService {
  constructor(
    private readonly repository: ArrearRepository,
    private readonly payrollRunRepository: PayrollRunRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  /** Called by SalaryRevisionService.apply() right after it writes the new EmployeeCompensation. */
  async createFromSalaryRevision(tenantId: string, revision: SalaryRevision, postedByUserId: string): Promise<ArrearEntry | null> {
    const basicDelta = revision.proposedMonthlyBasic - revision.previousMonthlyBasic;
    if (basicDelta === 0) return null;

    const fromYear = revision.effectiveDate.getUTCFullYear();
    const fromMonth = revision.effectiveDate.getUTCMonth() + 1;
    const paidPeriods = await this.payrollRunRepository.countPaidPeriodsForEmployeeFrom(
      tenantId,
      revision.employeeId,
      fromYear,
      fromMonth,
    );
    if (paidPeriods === 0) return null;

    const grossDeltaPerPeriod = basicDelta * (1 + HRA_RATE);
    const amount = round2(grossDeltaPerPeriod * paidPeriods);

    return this.repository.create(tenantId, {
      employeeId: revision.employeeId,
      sourceType: "SalaryRevision",
      sourceId: revision.id,
      description: `Retro adjustment for salary revision effective ${revision.effectiveDate.toISOString().slice(0, 10)}, covering ${paidPeriods} already-paid period(s)`,
      amount,
      postedByUserId,
    });
  }

  /** Called by PayrollRunService.process() for each employee in the run — sums and claims their Pending entries. */
  async consumeForEmployee(tenantId: string, employeeId: string, payrollRunId: string, pending: ArrearEntry[]): Promise<number> {
    const mine = pending.filter((e) => e.employeeId === employeeId);
    if (mine.length === 0) return 0;
    await this.repository.markIncluded(
      tenantId,
      mine.map((e) => e.id),
      payrollRunId,
    );
    return round2(mine.reduce((sum, e) => sum + e.amount, 0));
  }

  async revertForRun(tenantId: string, payrollRunId: string): Promise<void> {
    await this.repository.revertIncludedForRun(tenantId, payrollRunId);
  }

  async findPendingForEmployeeIds(tenantId: string, employeeIds: string[]): Promise<ArrearEntry[]> {
    return this.repository.findPendingForEmployeeIds(tenantId, employeeIds);
  }

  /** Called by FnfService — an exiting employee has no future payroll run left to include arrears in, so they're settled straight into the FnF case. */
  async settleForEmployee(tenantId: string, employeeId: string): Promise<number> {
    const pending = await this.repository.findPendingForEmployee(tenantId, employeeId);
    const total = round2(pending.reduce((sum, e) => sum + e.amount, 0));
    await this.repository.markPaidForEmployee(tenantId, employeeId);
    return total;
  }

  async listForEmployee(employeeId: string) {
    const { tenantId } = this.requireAuthenticated();
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
