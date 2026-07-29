import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../platform/prisma/prisma.service";

const SPENT_EXPENSE_STATUSES = ["Approved", "Paid"];
const SPENT_PER_DIEM_STATUSES = ["Approved", "Paid"];
const SPENT_TRAVEL_ADVANCE_STATUSES = ["Approved", "Disbursed"];

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class DepartmentBudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllocation(tenantId: string, departmentId: string, periodYear: number) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.departmentBudget.findFirst({ where: { tenantId, departmentId, periodYear } }),
    );
  }

  setAllocation(tenantId: string, departmentId: string, periodYear: number, allocatedAmount: number) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.departmentBudget.upsert({
        where: { tenantId_departmentId_periodYear: { tenantId, departmentId, periodYear } },
        create: { tenantId, departmentId, periodYear, allocatedAmount },
        update: { allocatedAmount },
      }),
    );
  }

  /** Live spend rollup for one department/year — never stored, recomputed from real claim rows every call. */
  async getSpend(tenantId: string, departmentId: string, periodYear: number) {
    const yearStart = new Date(Date.UTC(periodYear, 0, 1));
    const yearEnd = new Date(Date.UTC(periodYear + 1, 0, 1));

    return this.prisma.withTenant(tenantId, async (tx) => {
      const employees = await tx.employee.findMany({ where: { tenantId, departmentId }, select: { id: true } });
      const employeeIds = employees.map((e) => e.id);
      if (employeeIds.length === 0) {
        return { expenseTotal: 0, perDiemTotal: 0, travelAdvanceTotal: 0 };
      }

      const [expense, perDiem, travelAdvance] = await Promise.all([
        tx.expenseClaim.aggregate({
          where: {
            tenantId,
            employeeId: { in: employeeIds },
            status: { in: SPENT_EXPENSE_STATUSES },
            createdAt: { gte: yearStart, lt: yearEnd },
          },
          _sum: { amount: true },
        }),
        tx.perDiemClaim.aggregate({
          where: {
            tenantId,
            employeeId: { in: employeeIds },
            status: { in: SPENT_PER_DIEM_STATUSES },
            createdAt: { gte: yearStart, lt: yearEnd },
          },
          _sum: { computedAmount: true },
        }),
        tx.travelAdvance.aggregate({
          where: {
            tenantId,
            employeeId: { in: employeeIds },
            status: { in: SPENT_TRAVEL_ADVANCE_STATUSES },
            createdAt: { gte: yearStart, lt: yearEnd },
          },
          _sum: { approvedAmount: true },
        }),
      ]);

      return {
        expenseTotal: expense._sum.amount ?? 0,
        perDiemTotal: perDiem._sum.computedAmount ?? 0,
        travelAdvanceTotal: travelAdvance._sum.approvedAmount ?? 0,
      };
    });
  }
}
