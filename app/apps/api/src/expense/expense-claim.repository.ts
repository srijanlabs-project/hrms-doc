import { Injectable } from "@nestjs/common";
import type { ExpenseClaim, Prisma } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

export type ExpenseClaimWithEmployee = ExpenseClaim & {
  employee: { id: string; legalName: string; employeeCode: string };
  receiptFile: { id: string; originalName: string; mimeType: string } | null;
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
  receiptFile: { select: { id: true, originalName: true, mimeType: true } },
} satisfies Prisma.ExpenseClaimInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ExpenseClaimRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.ExpenseClaimUncheckedCreateInput, "tenantId">,
  ): Promise<ExpenseClaimWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.expenseClaim.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findById(tenantId: string, id: string): Promise<ExpenseClaimWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.expenseClaim.findFirst({ where: { id, tenantId, deletedAt: null }, include: includeEmployee }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<ExpenseClaimWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.expenseClaim.findMany({
        where: { tenantId, employeeId, deletedAt: null },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  /** Tenant-wide, for org_admin/hr_ops — a claim's approver may not be the only one who can act on it. */
  findAll(tenantId: string): Promise<ExpenseClaimWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.expenseClaim.findMany({
        where: { tenantId, deletedAt: null },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findForApprover(tenantId: string, approverId: string): Promise<ExpenseClaimWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.expenseClaim.findMany({
        where: { tenantId, approverId, deletedAt: null },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  async decide(
    tenantId: string,
    id: string,
    data: { status: string; decisionNote?: string; decidedByUserId: string },
  ): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.expenseClaim.updateMany({
        where: { id, tenantId },
        data: { ...data, decidedAt: new Date() },
      }),
    );
  }

  async cancel(tenantId: string, id: string, employeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.expenseClaim.updateMany({
        where: { id, tenantId, employeeId, status: "Pending" },
        data: { status: "Cancelled" },
      }),
    );
    return result.count;
  }

  async markPaid(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.expenseClaim.updateMany({
        where: { id, tenantId, status: "Approved" },
        data: { status: "Paid", paidAt: new Date() },
      }),
    );
    return result.count;
  }
}
