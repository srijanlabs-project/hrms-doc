import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { AttendanceRepository } from "../../attendance/attendance.repository";
import { NotificationService } from "../../notifications/notification.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { ArrearService } from "../arrear/arrear.service";
import { computeGrossToNet, round2 } from "../calc/payroll-calculator";
import { CompensationRepository } from "../compensation/compensation.repository";
import { LoanAdvanceRepository } from "../loan-advance/loan-advance.repository";
import { PayComponentService } from "../pay-component/pay-component.service";
import { WebhookDispatchService } from "../../webhook/webhook.service";
import type { CreatePayrollRunDto } from "./dto/create-payroll-run.dto";
import { PayrollRunRepository } from "./payroll-run.repository";

function periodRange(periodYear: number, periodMonth: number): { start: Date; end: Date; totalWorkingDays: number } {
  const start = new Date(Date.UTC(periodYear, periodMonth - 1, 1));
  const end = new Date(Date.UTC(periodYear, periodMonth, 0));
  return { start, end, totalWorkingDays: end.getUTCDate() };
}

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-PAYROLL-001",
    code: "PAYROLL-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-PAYROLL-RUN",
    details: { currentState },
  });
}

@Injectable()
export class PayrollRunService {
  constructor(
    private readonly repository: PayrollRunRepository,
    private readonly compensationRepository: CompensationRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly payComponentService: PayComponentService,
    private readonly arrearService: ArrearService,
    private readonly loanAdvanceRepository: LoanAdvanceRepository,
    private readonly webhookDispatchService: WebhookDispatchService,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async getById(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const run = await this.findRunOrThrow(tenantId, id);
    return run;
  }

  async create(dto: CreatePayrollRunDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, dto.periodYear, dto.periodMonth);
    } catch {
      throw stateConflict(`A payroll run for ${dto.periodYear}-${dto.periodMonth} already exists.`, "Duplicate");
    }
  }

  /**
   * Gross-to-net for every Active employee. Employees without an
   * EmployeeCompensation record are still listed (so processors can see
   * who's missing setup) with all pay fields left null and hasException
   * true — the spec's blocking-vs-non-blocking exception split
   * (05-payroll-processing.md §4) is deferred; v1 only flags, never blocks.
   * Re-runnable while Draft/Processed (full result replace each time).
   */
  async process(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const run = await this.findRunOrThrow(tenantId, id);
    if (run.status !== "Draft" && run.status !== "Processed") {
      throw stateConflict("Only Draft or Processed runs can be (re)processed.", run.status);
    }

    const { start, end, totalWorkingDays } = periodRange(run.periodYear, run.periodMonth);
    const employees = (await this.employeeRepository.findAll(tenantId)).filter((e) => e.status === "Active");
    const employeeIds = employees.map((e) => e.id);

    // Reprocessing must not double-claim arrears this same run already consumed on a prior pass.
    await this.arrearService.revertForRun(tenantId, id);

    const [compensations, attendance, componentAssignments, pendingArrears, activeLoans] = await Promise.all([
      this.compensationRepository.findForEmployeeIds(tenantId, employeeIds),
      this.attendanceRepository.findForEmployeesRange(tenantId, employeeIds, start, end),
      this.payComponentService.findActiveForEmployeeIds(tenantId, employeeIds),
      this.arrearService.findPendingForEmployeeIds(tenantId, employeeIds),
      this.loanAdvanceRepository.findActiveForEmployeeIds(tenantId, employeeIds),
    ]);
    const compensationByEmployeeId = new Map(compensations.map((c) => [c.employeeId, c]));

    const loanInstallmentByEmployeeId = new Map<string, number>();
    for (const loan of activeLoans) {
      const installment = Math.min(loan.monthlyInstallment, loan.outstandingBalance);
      loanInstallmentByEmployeeId.set(loan.employeeId, round2((loanInstallmentByEmployeeId.get(loan.employeeId) ?? 0) + installment));
    }

    const attendanceByEmployeeId = new Map<string, { absent: number; half: number }>();
    for (const day of attendance) {
      const bucket = attendanceByEmployeeId.get(day.employeeId) ?? { absent: 0, half: 0 };
      if (day.status === "Absent") bucket.absent += 1;
      if (day.status === "HalfDay") bucket.half += 1;
      attendanceByEmployeeId.set(day.employeeId, bucket);
    }

    const componentsByEmployeeId = new Map<string, typeof componentAssignments>();
    for (const assignment of componentAssignments) {
      const list = componentsByEmployeeId.get(assignment.employeeId) ?? [];
      list.push(assignment);
      componentsByEmployeeId.set(assignment.employeeId, list);
    }

    const rows = [];
    for (const employee of employees) {
      const bucket = attendanceByEmployeeId.get(employee.id) ?? { absent: 0, half: 0 };
      const payableDays = Math.max(0, totalWorkingDays - bucket.absent - 0.5 * bucket.half);
      const compensation = compensationByEmployeeId.get(employee.id);

      if (!compensation) {
        rows.push({
          employeeId: employee.id,
          payableDays,
          totalWorkingDays,
          hasException: true,
          exceptionNote: "No compensation record on file.",
        });
        continue;
      }

      const proratedBasic = round2((compensation.monthlyBasic * payableDays) / totalWorkingDays);
      const { earnings, deductions } = this.payComponentService.computeTotals(
        componentsByEmployeeId.get(employee.id) ?? [],
        proratedBasic,
      );
      const arrearsIncluded = await this.arrearService.consumeForEmployee(tenantId, employee.id, id, pendingArrears);
      const loanInstallment = loanInstallmentByEmployeeId.get(employee.id) ?? 0;

      const calc = computeGrossToNet({
        monthlyBasic: compensation.monthlyBasic,
        payableDays,
        totalWorkingDays,
        componentEarnings: earnings,
        componentDeductions: round2(deductions + loanInstallment),
        arrearsIncluded,
      });
      rows.push({ employeeId: employee.id, payableDays, totalWorkingDays, hasException: false, ...calc });
    }

    await this.repository.replaceResults(tenantId, id, rows);
    return this.repository.updateStatus(tenantId, id, { status: "Processed", processedAt: new Date() });
  }

  async approve(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const run = await this.findRunOrThrow(tenantId, id);
    if (run.status !== "Processed") {
      throw stateConflict("Only Processed runs can be approved.", run.status);
    }

    const updated = await this.repository.updateStatus(tenantId, id, {
      status: "Approved",
      approvedAt: new Date(),
      approvedByUserId: userId,
    });

    const payableEmployeeIds = run.results.filter((r) => !r.hasException).map((r) => r.employeeId);
    const activeLoans = await this.loanAdvanceRepository.findActiveForEmployeeIds(tenantId, payableEmployeeIds);
    await Promise.all(
      activeLoans.map((loan) => {
        const installment = Math.min(loan.monthlyInstallment, loan.outstandingBalance);
        return this.loanAdvanceRepository.applyInstallment(tenantId, loan.id, round2(loan.outstandingBalance - installment));
      }),
    );

    await Promise.all(
      run.results
        .filter((r) => !r.hasException)
        .map(async (result) => {
          const user = await this.authRepository.findUserByEmployeeId(tenantId, result.employeeId);
          if (!user) return;
          await this.notificationService.notify(tenantId, user.id, {
            type: "payroll.payslip.available",
            title: "Payslip available",
            body: `Your payslip for ${run.periodMonth}/${run.periodYear} is now available.`,
            linkPath: "/payslips",
          });
        }),
    );

    await this.webhookDispatchService.dispatch(tenantId, "payroll.run.approved", {
      runId: id,
      periodYear: run.periodYear,
      periodMonth: run.periodMonth,
      employeeCount: run.results.filter((r) => !r.hasException).length,
    });

    return updated;
  }

  async close(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const run = await this.findRunOrThrow(tenantId, id);
    if (run.status !== "Approved") {
      throw stateConflict("Only Approved runs can be closed.", run.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Closed", closedAt: new Date() });
  }

  private async findRunOrThrow(tenantId: string, id: string) {
    const run = await this.repository.findById(tenantId, id);
    if (!run) {
      throw new NotFoundAppError("OBJ-PAYROLL-RUN", "Payroll run not found.");
    }
    return run;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
