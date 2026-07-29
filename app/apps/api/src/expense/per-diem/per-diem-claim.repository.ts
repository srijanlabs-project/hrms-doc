import { Injectable } from "@nestjs/common";
import type { PerDiemClaim, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type PerDiemClaimWithEmployee = PerDiemClaim & {
  employee: { id: string; legalName: string; employeeCode: string };
  policy: { id: string; category: string; dailyRate: number };
};

const includeAll = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
  policy: { select: { id: true, category: true, dailyRate: true } },
} satisfies Prisma.PerDiemClaimInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PerDiemClaimRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.PerDiemClaimUncheckedCreateInput, "tenantId">,
  ): Promise<PerDiemClaimWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.perDiemClaim.create({ data: { ...data, tenantId }, include: includeAll }),
    );
  }

  findById(tenantId: string, id: string): Promise<PerDiemClaimWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.perDiemClaim.findFirst({ where: { id, tenantId }, include: includeAll }));
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<PerDiemClaimWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.perDiemClaim.findMany({ where: { tenantId, employeeId }, include: includeAll, orderBy: { createdAt: "desc" } }),
    );
  }

  findForApprover(tenantId: string, approverId: string): Promise<PerDiemClaimWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.perDiemClaim.findMany({ where: { tenantId, approverId }, include: includeAll, orderBy: { createdAt: "desc" } }),
    );
  }

  findAll(tenantId: string): Promise<PerDiemClaimWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.perDiemClaim.findMany({ where: { tenantId }, include: includeAll, orderBy: { createdAt: "desc" } }),
    );
  }

  async decide(
    tenantId: string,
    id: string,
    data: { status: string; decisionNote?: string; decidedByUserId: string },
  ): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.perDiemClaim.updateMany({ where: { id, tenantId }, data: { ...data, decidedAt: new Date() } }),
    );
  }

  async markPaid(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.perDiemClaim.updateMany({ where: { id, tenantId, status: "Approved" }, data: { status: "Paid", paidAt: new Date() } }),
    );
    return result.count;
  }
}
