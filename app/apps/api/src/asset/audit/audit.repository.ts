import { Injectable } from "@nestjs/common";
import type { Asset, AssetAuditCycle, AssetAuditItem } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

const itemInclude = {
  asset: { select: { id: true, assetTag: true, category: true, name: true } },
} as const;

export type AssetAuditItemWithAsset = AssetAuditItem & {
  asset: { id: string; assetTag: string; category: string; name: string };
};

export type AssetAuditCycleWithCount = AssetAuditCycle & { _count: { items: number } };
export type AssetAuditCycleWithItems = AssetAuditCycle & { items: AssetAuditItemWithAsset[] };

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class AssetAuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOpenCycle(tenantId: string): Promise<AssetAuditCycle | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.assetAuditCycle.findFirst({ where: { tenantId, status: "Open" } }));
  }

  findNonRetiredAssets(tenantId: string): Promise<Asset[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.asset.findMany({ where: { tenantId, deletedAt: null, status: { not: "Retired" } } }),
    );
  }

  createCycle(
    tenantId: string,
    periodLabel: string,
    items: { assetId: string; statusSnapshot: string; assignedToSnapshot: string | null }[],
  ): Promise<AssetAuditCycleWithItems> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAuditCycle.create({
        data: { tenantId, periodLabel, items: { create: items.map((i) => ({ tenantId, ...i })) } },
        include: { items: { include: itemInclude } },
      }),
    );
  }

  findAllCycles(tenantId: string): Promise<AssetAuditCycleWithCount[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAuditCycle.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { items: true } } },
      }),
    );
  }

  findCycleWithItems(tenantId: string, id: string): Promise<AssetAuditCycleWithItems | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAuditCycle.findFirst({
        where: { id, tenantId },
        include: { items: { include: itemInclude, orderBy: { createdAt: "asc" } } },
      }),
    );
  }

  findItemById(tenantId: string, itemId: string): Promise<AssetAuditItem | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.assetAuditItem.findFirst({ where: { id: itemId, tenantId } }));
  }

  countPendingItems(tenantId: string, cycleId: string): Promise<number> {
    return this.prisma.withTenant(tenantId, (tx) => tx.assetAuditItem.count({ where: { tenantId, cycleId, finding: "Pending" } }));
  }

  decideItem(
    tenantId: string,
    itemId: string,
    finding: "Verified" | "Missing" | "Damaged",
    reviewedByUserId: string,
    notes?: string,
  ): Promise<AssetAuditItem> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAuditItem.update({ where: { id: itemId }, data: { finding, reviewedByUserId, reviewedAt: new Date(), notes } }),
    );
  }

  closeCycle(tenantId: string, cycleId: string): Promise<AssetAuditCycle> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAuditCycle.update({ where: { id: cycleId }, data: { status: "Closed", closedAt: new Date() } }),
    );
  }
}
