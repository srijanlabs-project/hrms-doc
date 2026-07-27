import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../platform/prisma/prisma.service";

const itemInclude = { user: { select: { id: true, email: true, status: true } } } as const;

@Injectable()
export class AccessReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOpenCycle(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.accessReviewCycle.findFirst({ where: { tenantId, status: "Open" } }));
  }

  findActiveUsersForReview(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findMany({ where: { tenantId, status: "Active", deletedAt: null }, select: { id: true, roles: true } }),
    );
  }

  createCycle(tenantId: string, periodLabel: string, users: { id: string; roles: string[] }[]) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.accessReviewCycle.create({
        data: {
          tenantId,
          periodLabel,
          items: {
            create: users.map((u) => ({ tenantId, userId: u.id, rolesSnapshot: u.roles })),
          },
        },
        include: { items: { include: itemInclude } },
      }),
    );
  }

  findAllCycles(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.accessReviewCycle.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { items: true } } },
      }),
    );
  }

  findCycleWithItems(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.accessReviewCycle.findFirst({
        where: { id, tenantId },
        include: { items: { include: itemInclude, orderBy: { createdAt: "asc" } } },
      }),
    );
  }

  findItemById(tenantId: string, itemId: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.accessReviewItem.findFirst({ where: { id: itemId, tenantId } }));
  }

  countPendingItems(tenantId: string, cycleId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.accessReviewItem.count({ where: { tenantId, cycleId, decision: "Pending" } }),
    );
  }

  decideItem(tenantId: string, itemId: string, decision: "Confirmed" | "Revoked", reviewedByUserId: string, notes?: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.accessReviewItem.update({
        where: { id: itemId },
        data: { decision, reviewedByUserId, reviewedAt: new Date(), notes },
      }),
    );
  }

  closeCycle(tenantId: string, cycleId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.accessReviewCycle.update({ where: { id: cycleId }, data: { status: "Closed", closedAt: new Date() } }),
    );
  }

  suspendUser(tenantId: string, userId: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.user.update({ where: { id: userId }, data: { status: "Suspended" } }));
  }
}
