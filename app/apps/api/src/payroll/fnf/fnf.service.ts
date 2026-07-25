import { Injectable } from "@nestjs/common";
import { LeaveBalanceService } from "../../leave/balance/leave-balance.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { AuditService } from "../../platform/audit/audit.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { ArrearService } from "../arrear/arrear.service";
import { computeGrossToNet, round2 } from "../calc/payroll-calculator";
import { CompensationRepository } from "../compensation/compensation.repository";
import { PayComponentRepository } from "../pay-component/pay-component.repository";
import { PayComponentService } from "../pay-component/pay-component.service";
import { FnfRepository } from "./fnf.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-FNF-001",
    code: "FNF-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-FNF-CASE",
    details: { currentState },
  });
}

/** Days encashed per day-rate — monthlyBasic / 30, a common flat convention. Real policy may vary by state/contract. */
const DAYS_PER_MONTH_FOR_ENCASHMENT = 30;

/** Payment of Gratuity Act 1972: eligible only once actual service reaches 5 full years. */
const GRATUITY_MIN_SERVICE_MONTHS = 60;

/** Gratuity formula divisor and per-year multiple: (basic x 15 x years) / 26. */
const GRATUITY_DAYS_PER_YEAR = 15;
const GRATUITY_MONTH_DIVISOR = 26;

/**
 * Whole years of service for the gratuity formula, rounding a final part-year
 * up to a full year once it passes 6 months — the convention used under the
 * Payment of Gratuity Act 1972.
 */
function gratuityYearsOfService(joiningDate: Date, exitDate: Date): { years: number; totalMonths: number } {
  const totalMonths =
    (exitDate.getUTCFullYear() - joiningDate.getUTCFullYear()) * 12 +
    (exitDate.getUTCMonth() - joiningDate.getUTCMonth()) -
    (exitDate.getUTCDate() < joiningDate.getUTCDate() ? 1 : 0);
  const years = Math.floor(totalMonths / 12);
  const remainderMonths = totalMonths - years * 12;
  return { years: remainderMonths >= 6 ? years + 1 : years, totalMonths };
}

/**
 * v1 slice of docs/08-submodule-specifications/09-payroll/07-full-and-final-settlement.md.
 * Four components: final-month gross-to-net (same calculator regular
 * payroll uses), unused Annual-leave encashment (via LeaveBalanceService's
 * existing formula), any still-Pending ArrearEntry rows for the employee,
 * and statutory gratuity (Payment of Gratuity Act 1972 formula, only once
 * service crosses 5 years). No recoveries/waivers (no asset-damage billing
 * module exists to source them from), no payment-channel integration.
 */
@Injectable()
export class FnfService {
  constructor(
    private readonly repository: FnfRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly compensationRepository: CompensationRepository,
    private readonly payComponentRepository: PayComponentRepository,
    private readonly payComponentService: PayComponentService,
    private readonly leaveBalanceService: LeaveBalanceService,
    private readonly arrearService: ArrearService,
    private readonly requestContext: RequestContextService,
    private readonly audit: AuditService,
  ) {}

  async createFromExit(employeeId: string) {
    const { tenantId } = this.requireAuthenticated();

    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    if (employee.status !== "Separated" || !employee.lastWorkingDay) {
      throw new ValidationAppError([
        { field: "employeeId", code: "NOT_EXITED", message: "Employee must be Separated with a last working day recorded." },
      ]);
    }
    const existing = await this.repository.findByEmployeeId(tenantId, employeeId);
    if (existing) {
      throw stateConflict("A full-and-final case already exists for this employee.", existing.status);
    }

    const compensation = await this.compensationRepository.findByEmployeeId(tenantId, employeeId);
    if (!compensation) {
      throw new ValidationAppError([{ field: "employeeId", code: "NO_COMPENSATION", message: "Employee has no compensation record on file." }]);
    }

    const exitDate = employee.lastWorkingDay;
    const daysInExitMonth = new Date(Date.UTC(exitDate.getUTCFullYear(), exitDate.getUTCMonth() + 1, 0)).getUTCDate();
    const payableDays = exitDate.getUTCDate();

    const assignments = await this.payComponentRepository.findForEmployee(tenantId, employeeId);
    const activeAssignments = assignments.filter((a) => a.isActive && a.payComponent.isActive);
    const proratedBasic = round2((compensation.monthlyBasic * payableDays) / daysInExitMonth);
    const { earnings: componentEarnings, deductions: componentDeductions } = this.payComponentService.computeTotals(
      activeAssignments,
      proratedBasic,
    );

    const finalMonthCalc = computeGrossToNet({
      monthlyBasic: compensation.monthlyBasic,
      payableDays,
      totalWorkingDays: daysInExitMonth,
      componentEarnings,
      componentDeductions,
    });

    const availableAnnualDays = await this.leaveBalanceService.getAvailable(tenantId, employeeId, employee.joiningDate, "Annual");
    const leaveEncashment = round2((compensation.monthlyBasic / DAYS_PER_MONTH_FOR_ENCASHMENT) * availableAnnualDays);

    const arrearsIncluded = await this.arrearService.settleForEmployee(tenantId, employeeId);

    let gratuityAmount = 0;
    if (employee.joiningDate) {
      const { years, totalMonths } = gratuityYearsOfService(employee.joiningDate, exitDate);
      if (totalMonths >= GRATUITY_MIN_SERVICE_MONTHS) {
        gratuityAmount = round2((compensation.monthlyBasic * GRATUITY_DAYS_PER_YEAR * years) / GRATUITY_MONTH_DIVISOR);
      }
    }

    const netPayable = round2(finalMonthCalc.netPay + leaveEncashment + arrearsIncluded + gratuityAmount);

    const fnfCase = await this.repository.create(tenantId, {
      employeeId,
      exitDate,
      finalMonthNetPay: finalMonthCalc.netPay,
      leaveEncashment,
      arrearsIncluded,
      gratuityAmount,
      netPayable,
    });

    await this.audit.record({
      entityType: "FnfCase",
      entityId: fnfCase.id,
      action: "FnfCase.calculate",
      after: { finalMonthNetPay: finalMonthCalc.netPay, leaveEncashment, arrearsIncluded, gratuityAmount, netPayable },
    });

    return fnfCase;
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listAll(tenantId);
  }

  async getById(id: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.findOrThrow(tenantId, id);
  }

  async approve(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const fnfCase = await this.findOrThrow(tenantId, id);
    if (fnfCase.status !== "Draft") {
      throw stateConflict("Only a Draft case can be approved.", fnfCase.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Approved", approvedByUserId: userId, approvedAt: new Date() });
  }

  async release(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const fnfCase = await this.findOrThrow(tenantId, id);
    if (fnfCase.status !== "Approved") {
      throw stateConflict("Only an Approved case can be released.", fnfCase.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Released", releasedAt: new Date() });
  }

  private async findOrThrow(tenantId: string, id: string) {
    const fnfCase = await this.repository.findById(tenantId, id);
    if (!fnfCase) {
      throw new NotFoundAppError("OBJ-FNF-CASE", "Full-and-final case not found.");
    }
    return fnfCase;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
