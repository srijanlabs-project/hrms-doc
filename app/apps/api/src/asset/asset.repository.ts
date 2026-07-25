import { Injectable } from "@nestjs/common";
import type { Asset, Prisma } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class AssetRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.AssetUncheckedCreateInput, "tenantId">): Promise<Asset> {
    return this.prisma.withTenant(tenantId, (tx) => tx.asset.create({ data: { ...data, tenantId } }));
  }

  findById(tenantId: string, id: string): Promise<Asset | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.asset.findFirst({ where: { id, tenantId, deletedAt: null } }));
  }

  findAll(tenantId: string): Promise<Asset[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.asset.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "desc" } }),
    );
  }

  async setStatus(tenantId: string, id: string, status: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) => tx.asset.updateMany({ where: { id, tenantId }, data: { status } }));
  }

  /** Only succeeds if the asset is currently Available — guards against double-assignment races. */
  async markAssigned(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.asset.updateMany({ where: { id, tenantId, status: "Available" }, data: { status: "Assigned" } }),
    );
    return result.count;
  }
}
