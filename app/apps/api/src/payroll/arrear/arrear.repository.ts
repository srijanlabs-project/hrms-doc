import { Injectable } from "@nestjs/common";
import type { ArrearEntry, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ArrearRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.ArrearEntryUncheckedCreateInput, "tenantId">): Promise<ArrearEntry> {
    return this.prisma.withTenant(tenantId, (tx) => tx.arrearEntry.create({ data: { ...data, tenantId } }));
  }

  findPendingForEmployee(tenantId: string, employeeId: string): Promise<ArrearEntry[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.arrearEntry.findMany({ where: { tenantId, employeeId, status: "Pending" } }),
    );
  }

  /** For payroll run processing — every employee's Pending arrears in one query. */
  findPendingForEmployeeIds(tenantId: string, employeeIds: string[]): Promise<ArrearEntry[]> {
    if (employeeIds.length === 0) return Promise.resolve([]);
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.arrearEntry.findMany({ where: { tenantId, employeeId: { in: employeeIds }, status: "Pending" } }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<ArrearEntry[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.arrearEntry.findMany({ where: { tenantId, employeeId }, orderBy: { createdAt: "desc" } }),
    );
  }

  async markIncluded(tenantId: string, ids: string[], payrollRunId: string): Promise<void> {
    if (ids.length === 0) return;
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.arrearEntry.updateMany({ where: { id: { in: ids }, tenantId }, data: { status: "Included", payrollRunId } }),
    );
  }

  /** Reverts any entries this run had claimed, before a reprocess recomputes fresh — keeps re-runs idempotent. */
  async revertIncludedForRun(tenantId: string, payrollRunId: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.arrearEntry.updateMany({ where: { tenantId, payrollRunId, status: "Included" }, data: { status: "Pending", payrollRunId: null } }),
    );
  }

  async markPaidForEmployee(tenantId: string, employeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.arrearEntry.updateMany({
        where: { tenantId, employeeId, status: { in: ["Pending", "Included"] } },
        data: { status: "Paid" },
      }),
    );
    return result.count;
  }
}
