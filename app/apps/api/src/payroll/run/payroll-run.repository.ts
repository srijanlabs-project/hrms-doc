import { Injectable } from "@nestjs/common";
import type { PayrollRun, PayrollRunResult, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type PayrollRunWithResults = PayrollRun & {
  results: (PayrollRunResult & { employee: { id: string; legalName: string; employeeCode: string } })[];
};

const includeResults = {
  results: {
    include: { employee: { select: { id: true, legalName: true, employeeCode: true } } },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.PayrollRunInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PayrollRunRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, periodYear: number, periodMonth: number): Promise<PayrollRun> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payrollRun.create({ data: { tenantId, periodYear, periodMonth } }),
    );
  }

  findAll(tenantId: string): Promise<PayrollRun[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payrollRun.findMany({ where: { tenantId }, orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }] }),
    );
  }

  findById(tenantId: string, id: string): Promise<PayrollRunWithResults | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payrollRun.findFirst({ where: { id, tenantId }, include: includeResults }),
    );
  }

  /** Replaces every result row for the run — safe to call repeatedly while the run is Draft/Processed (pre-approval recalculation). */
  async replaceResults(
    tenantId: string,
    runId: string,
    rows: Omit<Prisma.PayrollRunResultUncheckedCreateInput, "tenantId" | "payrollRunId">[],
  ): Promise<void> {
    await this.prisma.withTenant(tenantId, async (tx) => {
      await tx.payrollRunResult.deleteMany({ where: { tenantId, payrollRunId: runId } });
      await tx.payrollRunResult.createMany({
        data: rows.map((row) => ({ ...row, tenantId, payrollRunId: runId })),
      });
    });
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<Pick<PayrollRun, "status" | "processedAt" | "approvedAt" | "approvedByUserId" | "closedAt">>,
  ): Promise<PayrollRun> {
    return this.prisma.withTenant(tenantId, (tx) => tx.payrollRun.update({ where: { id }, data }));
  }

  /** Latest Closed run with results — used by the Reports module's payroll-cost KPI. */
  findLatestClosed(tenantId: string): Promise<PayrollRunWithResults | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payrollRun.findFirst({
        where: { tenantId, status: "Closed" },
        orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
        include: includeResults,
      }),
    );
  }

  /** Payslip lookup: only ever resolves results belonging to an Approved or Closed run — Draft/Processed numbers are not yet authoritative enough to show an employee. */
  findApprovedResultForEmployee(
    tenantId: string,
    employeeId: string,
    periodYear: number,
    periodMonth: number,
  ): Promise<(PayrollRunResult & { payrollRun: PayrollRun }) | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payrollRunResult.findFirst({
        where: {
          tenantId,
          employeeId,
          payrollRun: { periodYear, periodMonth, status: { in: ["Approved", "Closed"] } },
        },
        include: { payrollRun: true },
      }),
    );
  }

  /**
   * Count of already-Processed/Approved/Closed periods (from fromYear/fromMonth
   * onward) where this employee actually has a result row — i.e. periods
   * already paid at the pre-revision rate. Used by ArrearService to size a
   * retro adjustment; a period with no result row for this employee (e.g.
   * they joined later, or the run predates them) contributes nothing.
   */
  async countPaidPeriodsForEmployeeFrom(
    tenantId: string,
    employeeId: string,
    fromYear: number,
    fromMonth: number,
  ): Promise<number> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payrollRunResult.count({
        where: {
          tenantId,
          employeeId,
          hasException: false,
          payrollRun: {
            status: { in: ["Processed", "Approved", "Closed"] },
            OR: [
              { periodYear: { gt: fromYear } },
              { periodYear: fromYear, periodMonth: { gte: fromMonth } },
            ],
          },
        },
      }),
    );
  }

  findApprovedResultsForEmployee(
    tenantId: string,
    employeeId: string,
  ): Promise<(PayrollRunResult & { payrollRun: PayrollRun })[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payrollRunResult.findMany({
        where: { tenantId, employeeId, payrollRun: { status: { in: ["Approved", "Closed"] } } },
        include: { payrollRun: true },
        orderBy: [{ payrollRun: { periodYear: "desc" } }, { payrollRun: { periodMonth: "desc" } }],
      }),
    );
  }
}
