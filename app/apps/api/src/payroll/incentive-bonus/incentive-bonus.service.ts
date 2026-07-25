import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import { ArrearRepository } from "../arrear/arrear.repository";
import type { CreateIncentiveBonusDto } from "./dto/create-incentive-bonus.dto";
import { IncentiveBonusRepository } from "./incentive-bonus.repository";

/**
 * v1 slice closing Payroll's "incentives and bonus" and "variable pay" gaps
 * (E09) — one type-tagged table for both, the same discipline used elsewhere
 * in this build. Admin-granted, not employee-requested: created directly
 * (no separate approval step, same shape as LeaveLedgerService's manual
 * adjustment) and immediately creates an ArrearEntry so the payout rides the
 * existing lump-sum-claimed-by-next-payroll-run mechanism — zero new
 * payroll-engine code.
 */
@Injectable()
export class IncentiveBonusService {
  constructor(
    private readonly repository: IncentiveBonusRepository,
    private readonly arrearRepository: ArrearRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async create(dto: CreateIncentiveBonusDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const record = await this.repository.create(tenantId, {
      employeeId: dto.employeeId,
      payType: dto.payType,
      amount: dto.amount,
      reason: dto.reason,
      postedByUserId: userId,
    });

    await this.arrearRepository.create(tenantId, {
      employeeId: dto.employeeId,
      sourceType: "IncentiveBonus",
      sourceId: record.id,
      description: `${dto.payType}: ${dto.reason}`,
      amount: dto.amount,
      postedByUserId: userId,
    });

    return record;
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
