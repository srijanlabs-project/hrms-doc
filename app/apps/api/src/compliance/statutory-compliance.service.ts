import { Injectable } from "@nestjs/common";
import { round2 } from "../payroll/calc/payroll-calculator";
import { CompensationRepository } from "../payroll/compensation/compensation.repository";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError } from "../platform/errors/errors";
import type { UpdateStatutorySettingsDto } from "./dto/update-statutory-settings.dto";
import { StatutoryComplianceRepository } from "./statutory-compliance.repository";

const SETTINGS_DEFAULTS = {
  minimumWageThreshold: 0,
  lwfEmployeeContribution: 0,
  lwfEmployerContribution: 0,
  lwfFrequencyMonths: 6,
  bonusEligibilityCeiling: 0,
  bonusPercent: 8.33,
};

/**
 * Real, computable statutory checks that ride the existing employee/
 * compensation data rather than a task-tracking deadline — a different shape
 * of "compliance" than the monthly ComplianceObligation calendar. Single
 * tenant-wide rate/threshold per check (matching the PT calculator's
 * single-tier simplification): no state-wise minimum-wage or LWF rate
 * tables exist in this v1 slice, so the tenant configures one applicable
 * figure. Gratuity is handled separately, inside FnfService, since it is
 * per-employee-on-exit rather than a tenant-wide periodic figure.
 */
@Injectable()
export class StatutoryComplianceService {
  constructor(
    private readonly repository: StatutoryComplianceRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly compensationRepository: CompensationRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async getSettings() {
    const { tenantId } = this.requireAuthenticated();
    const settings = await this.repository.find(tenantId);
    return settings ?? { ...SETTINGS_DEFAULTS, id: null, tenantId };
  }

  async updateSettings(dto: UpdateStatutorySettingsDto) {
    const { tenantId } = this.requireAuthenticated();
    const current = await this.getSettings();
    return this.repository.upsert(tenantId, {
      minimumWageThreshold: dto.minimumWageThreshold ?? current.minimumWageThreshold,
      lwfEmployeeContribution: dto.lwfEmployeeContribution ?? current.lwfEmployeeContribution,
      lwfEmployerContribution: dto.lwfEmployerContribution ?? current.lwfEmployerContribution,
      lwfFrequencyMonths: dto.lwfFrequencyMonths ?? current.lwfFrequencyMonths,
      bonusEligibilityCeiling: dto.bonusEligibilityCeiling ?? current.bonusEligibilityCeiling,
      bonusPercent: dto.bonusPercent ?? current.bonusPercent,
    });
  }

  async checkMinimumWages() {
    const { tenantId } = this.requireAuthenticated();
    const [settings, activeEmployees] = await Promise.all([this.getSettings(), this.employeeRepository.findActive(tenantId)]);
    const compensations = await this.compensationRepository.findForEmployeeIds(
      tenantId,
      activeEmployees.map((e) => e.id),
    );
    const basicByEmployeeId = new Map(compensations.map((c) => [c.employeeId, c.monthlyBasic]));

    return activeEmployees
      .filter((e) => basicByEmployeeId.has(e.id))
      .map((e) => {
        const monthlyBasic = basicByEmployeeId.get(e.id) as number;
        return {
          employeeId: e.id,
          employeeCode: e.employeeCode,
          legalName: e.legalName,
          monthlyBasic,
          threshold: settings.minimumWageThreshold,
          violation: monthlyBasic < settings.minimumWageThreshold,
        };
      });
  }

  async computeLwfLiability() {
    const { tenantId } = this.requireAuthenticated();
    const [settings, activeEmployees] = await Promise.all([this.getSettings(), this.employeeRepository.findActive(tenantId)]);
    const activeEmployeeCount = activeEmployees.length;
    const employeeContribution = round2(activeEmployeeCount * settings.lwfEmployeeContribution);
    const employerContribution = round2(activeEmployeeCount * settings.lwfEmployerContribution);
    return {
      activeEmployeeCount,
      employeeContribution,
      employerContribution,
      totalLiability: round2(employeeContribution + employerContribution),
      frequencyMonths: settings.lwfFrequencyMonths,
    };
  }

  async checkBonusEligibility() {
    const { tenantId } = this.requireAuthenticated();
    const [settings, activeEmployees] = await Promise.all([this.getSettings(), this.employeeRepository.findActive(tenantId)]);
    const compensations = await this.compensationRepository.findForEmployeeIds(
      tenantId,
      activeEmployees.map((e) => e.id),
    );
    const basicByEmployeeId = new Map(compensations.map((c) => [c.employeeId, c.monthlyBasic]));

    return activeEmployees
      .filter((e) => basicByEmployeeId.has(e.id))
      .map((e) => {
        const monthlyBasic = basicByEmployeeId.get(e.id) as number;
        const eligible = monthlyBasic <= settings.bonusEligibilityCeiling;
        const bonusAmount = eligible ? round2(monthlyBasic * 12 * (settings.bonusPercent / 100)) : 0;
        return { employeeId: e.id, employeeCode: e.employeeCode, legalName: e.legalName, monthlyBasic, eligible, bonusAmount };
      });
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
