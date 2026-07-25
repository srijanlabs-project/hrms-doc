import { Injectable } from "@nestjs/common";
import type { LeaveLedgerEntry, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class LeaveLedgerRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.LeaveLedgerEntryUncheckedCreateInput, "tenantId">): Promise<LeaveLedgerEntry> {
    return this.prisma.withTenant(tenantId, (tx) => tx.leaveLedgerEntry.create({ data: { ...data, tenantId } }));
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<LeaveLedgerEntry[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveLedgerEntry.findMany({ where: { tenantId, employeeId }, orderBy: [{ periodYear: "desc" }, { createdAt: "desc" }] }),
    );
  }

  /** Net of all ledger entries (adjustments + carry-forward) for one employee/leave-type/year — folds into the live balance formula. */
  async sumForEmployeeYear(tenantId: string, employeeId: string, leaveType: string, periodYear: number): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveLedgerEntry.aggregate({
        where: { tenantId, employeeId, leaveType, periodYear },
        _sum: { amountDays: true },
      }),
    );
    return result._sum.amountDays ?? 0;
  }

  /** Idempotency guard for runCarryForward — one CarryForward entry per employee/leave-type/target-year. */
  findExistingCarryForward(tenantId: string, employeeId: string, leaveType: string, periodYear: number): Promise<LeaveLedgerEntry | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveLedgerEntry.findFirst({ where: { tenantId, employeeId, leaveType, periodYear, entryType: "CarryForward" } }),
    );
  }
}
