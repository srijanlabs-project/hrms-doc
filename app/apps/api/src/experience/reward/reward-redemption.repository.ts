import { Injectable } from "@nestjs/common";
import type { Prisma, RewardRedemption } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type RewardRedemptionWithItem = RewardRedemption & {
  rewardItem: { id: string; name: string; pointsCost: number };
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeAll = {
  rewardItem: { select: { id: true, name: true, pointsCost: true } },
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.RewardRedemptionInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class RewardRedemptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: { employeeId: string; rewardItemId: string; pointsSpent: number },
  ): Promise<RewardRedemptionWithItem> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rewardRedemption.create({ data: { ...data, tenantId }, include: includeAll }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<RewardRedemptionWithItem[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rewardRedemption.findMany({ where: { tenantId, employeeId }, include: includeAll, orderBy: { createdAt: "desc" } }),
    );
  }

  findAllAdmin(tenantId: string): Promise<RewardRedemptionWithItem[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rewardRedemption.findMany({ where: { tenantId }, include: includeAll, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<RewardRedemptionWithItem | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rewardRedemption.findFirst({ where: { id, tenantId }, include: includeAll }),
    );
  }

  async sumSpentPoints(tenantId: string, employeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.rewardRedemption.aggregate({
        where: { tenantId, employeeId, status: { in: ["Requested", "Fulfilled"] } },
        _sum: { pointsSpent: true },
      }),
    );
    return result._sum.pointsSpent ?? 0;
  }

  fulfill(tenantId: string, id: string, decisionNote?: string): Promise<Prisma.BatchPayload> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rewardRedemption.updateMany({
        where: { id, tenantId, status: "Requested" },
        data: { status: "Fulfilled", fulfilledAt: new Date(), decisionNote },
      }),
    );
  }

  cancel(tenantId: string, id: string, decisionNote?: string): Promise<Prisma.BatchPayload> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rewardRedemption.updateMany({
        where: { id, tenantId, status: "Requested" },
        data: { status: "Cancelled", cancelledAt: new Date(), decisionNote },
      }),
    );
  }
}
