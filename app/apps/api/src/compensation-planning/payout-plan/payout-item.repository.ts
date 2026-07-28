import { Injectable } from "@nestjs/common";
import type { PayoutPlanItem, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type PayoutPlanItemWithEmployee = PayoutPlanItem & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.PayoutPlanItemInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PayoutItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    cycleId: string,
    data: { employeeId: string; proposedAmount: number; reason: string },
  ): Promise<PayoutPlanItemWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payoutPlanItem.create({ data: { tenantId, cycleId, ...data }, include: includeEmployee }),
    );
  }

  findForCycle(tenantId: string, cycleId: string): Promise<PayoutPlanItemWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payoutPlanItem.findMany({ where: { tenantId, cycleId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<PayoutPlanItemWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payoutPlanItem.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  approve(tenantId: string, id: string): Promise<PayoutPlanItem> {
    return this.prisma.withTenant(tenantId, (tx) => tx.payoutPlanItem.update({ where: { id }, data: { status: "Approved" } }));
  }

  reject(tenantId: string, id: string, decisionNote?: string): Promise<PayoutPlanItem> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payoutPlanItem.update({ where: { id }, data: { status: "Rejected", decisionNote } }),
    );
  }

  markPosted(tenantId: string, id: string): Promise<PayoutPlanItem> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payoutPlanItem.update({ where: { id }, data: { status: "Posted", postedAt: new Date() } }),
    );
  }
}
