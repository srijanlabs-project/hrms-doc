import { Injectable } from "@nestjs/common";
import type { LoanAdvance, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type LoanAdvanceWithEmployee = LoanAdvance & { employee: { id: string; legalName: string } };

const includeEmployee = { employee: { select: { id: true, legalName: true } } } satisfies Prisma.LoanAdvanceInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class LoanAdvanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.LoanAdvanceUncheckedCreateInput, "tenantId">): Promise<LoanAdvanceWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) => tx.loanAdvance.create({ data: { ...data, tenantId }, include: includeEmployee }));
  }

  findById(tenantId: string, id: string): Promise<LoanAdvanceWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.loanAdvance.findFirst({ where: { id, tenantId }, include: includeEmployee }));
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<LoanAdvanceWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.loanAdvance.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findAll(tenantId: string, status?: string): Promise<LoanAdvanceWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.loanAdvance.findMany({ where: { tenantId, status }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  async decide(
    tenantId: string,
    id: string,
    data: { status: string; outstandingBalance?: number; decisionNote?: string; decidedByUserId: string },
  ): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.loanAdvance.updateMany({ where: { id, tenantId, status: "Requested" }, data: { ...data, decidedAt: new Date() } }),
    );
    return result.count;
  }

  /** For payroll run processing — every employee's Active loans/advances in the run, in one query. */
  findActiveForEmployeeIds(tenantId: string, employeeIds: string[]): Promise<LoanAdvance[]> {
    if (employeeIds.length === 0) return Promise.resolve([]);
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.loanAdvance.findMany({ where: { tenantId, employeeId: { in: employeeIds }, status: "Active" } }),
    );
  }

  /** Commits one installment's worth of repayment on run approval — auto-closes at zero balance. */
  async applyInstallment(tenantId: string, id: string, newBalance: number): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.loanAdvance.update({
        where: { id },
        data:
          newBalance <= 0
            ? { outstandingBalance: 0, status: "Closed", closedAt: new Date() }
            : { outstandingBalance: newBalance },
      }),
    );
  }
}
