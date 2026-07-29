import { Injectable } from "@nestjs/common";
import { DepartmentRepository } from "../../org/department/department.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import type { SetDepartmentBudgetDto } from "./dto/set-department-budget.dto";
import { DepartmentBudgetRepository } from "./department-budget.repository";

function currentYear(): number {
  return new Date().getUTCFullYear();
}

/**
 * W5·P gap closure ("budget approvals"). No new approval workflow —
 * expense/travel/per-diem approvals already exist untouched. This just
 * gives the approving manager real budget context: allocated amount
 * (admin-set) versus spend (always live-computed from real claim rows,
 * never stored — same discipline as ESOP vesting, reward balances, travel
 * settlement elsewhere in this build).
 */
@Injectable()
export class DepartmentBudgetService {
  constructor(
    private readonly repository: DepartmentBudgetRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async setAllocation(departmentId: string, dto: SetDepartmentBudgetDto) {
    const tenantId = this.requestContext.tenantId!;
    await this.assertDepartmentInTenant(tenantId, departmentId);
    return this.repository.setAllocation(tenantId, departmentId, dto.periodYear, dto.allocatedAmount);
  }

  async getForDepartment(departmentId: string, periodYear?: number) {
    const tenantId = this.requestContext.tenantId!;
    await this.assertDepartmentInTenant(tenantId, departmentId);
    const year = periodYear ?? currentYear();
    return this.buildSummary(tenantId, departmentId, year);
  }

  private async assertDepartmentInTenant(tenantId: string, departmentId: string): Promise<void> {
    const department = await this.departmentRepository.findById(tenantId, departmentId);
    if (!department) {
      throw new NotFoundAppError("OBJ-DEPARTMENT", "Department not found.");
    }
  }

  /** Self-limiting like TeamDashboardService — a manager with no department linkage gets null, not a 404. */
  async getMine(periodYear?: number) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    if (!employee.departmentId) {
      return null;
    }
    const year = periodYear ?? currentYear();
    return this.buildSummary(tenantId, employee.departmentId, year);
  }

  private async buildSummary(tenantId: string, departmentId: string, periodYear: number) {
    const [allocation, spend] = await Promise.all([
      this.repository.findAllocation(tenantId, departmentId, periodYear),
      this.repository.getSpend(tenantId, departmentId, periodYear),
    ]);
    const spentTotal = spend.expenseTotal + spend.perDiemTotal + spend.travelAdvanceTotal;
    const allocatedAmount = allocation?.allocatedAmount ?? 0;
    return {
      departmentId,
      periodYear,
      allocatedAmount,
      spentTotal,
      remaining: allocatedAmount - spentTotal,
      utilizationPercent: allocatedAmount > 0 ? Math.round((spentTotal / allocatedAmount) * 100) : null,
      breakdown: spend,
    };
  }
}
