import { Injectable } from "@nestjs/common";
import type { Prisma, RewardCatalogItem } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class RewardCatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.RewardCatalogItemUncheckedCreateInput, "tenantId">): Promise<RewardCatalogItem> {
    return this.prisma.withTenant(tenantId, (tx) => tx.rewardCatalogItem.create({ data: { ...data, tenantId } }));
  }

  findActive(tenantId: string): Promise<RewardCatalogItem[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rewardCatalogItem.findMany({ where: { tenantId, active: true }, orderBy: { pointsCost: "asc" } }),
    );
  }

  findAll(tenantId: string): Promise<RewardCatalogItem[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.rewardCatalogItem.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }));
  }

  findById(tenantId: string, id: string): Promise<RewardCatalogItem | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.rewardCatalogItem.findFirst({ where: { id, tenantId } }));
  }
}
