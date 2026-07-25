import { Injectable } from "@nestjs/common";
import type { CompensationReviewItem, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type CompensationReviewItemWithEmployee = CompensationReviewItem & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.CompensationReviewItemInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    cycleId: string,
    employeeId: string,
    data: { currentMonthlyBasic: number; proposedMonthlyBasic: number },
  ): Promise<CompensationReviewItemWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.compensationReviewItem.create({
        data: { tenantId, cycleId, employeeId, ...data },
        include: includeEmployee,
      }),
    );
  }

  findForCycle(tenantId: string, cycleId: string): Promise<CompensationReviewItemWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.compensationReviewItem.findMany({
        where: { tenantId, cycleId },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<CompensationReviewItemWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.compensationReviewItem.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  updateProposal(tenantId: string, id: string, proposedMonthlyBasic: number): Promise<CompensationReviewItem> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.compensationReviewItem.update({ where: { id }, data: { proposedMonthlyBasic } }),
    );
  }

  approve(tenantId: string, id: string): Promise<CompensationReviewItem> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.compensationReviewItem.update({ where: { id }, data: { status: "Approved" } }),
    );
  }

  apply(tenantId: string, id: string): Promise<CompensationReviewItem> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.compensationReviewItem.update({ where: { id }, data: { status: "Applied", appliedAt: new Date() } }),
    );
  }
}
