import { Injectable } from "@nestjs/common";
import type { AssetMaintenanceRecord, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

const assetInclude = { asset: { select: { id: true, assetTag: true, category: true, name: true } } } as const;

export type MaintenanceRecordWithAsset = AssetMaintenanceRecord & {
  asset: { id: string; assetTag: string; category: string; name: string };
};

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class MaintenanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.AssetMaintenanceRecordUncheckedCreateInput, "tenantId">,
  ): Promise<MaintenanceRecordWithAsset> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetMaintenanceRecord.create({ data: { ...data, tenantId }, include: assetInclude }),
    );
  }

  findAll(tenantId: string): Promise<MaintenanceRecordWithAsset[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetMaintenanceRecord.findMany({ where: { tenantId }, include: assetInclude, orderBy: { scheduledDate: "desc" } }),
    );
  }

  findForAsset(tenantId: string, assetId: string): Promise<MaintenanceRecordWithAsset[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetMaintenanceRecord.findMany({
        where: { tenantId, assetId },
        include: assetInclude,
        orderBy: { scheduledDate: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<MaintenanceRecordWithAsset | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetMaintenanceRecord.findFirst({ where: { id, tenantId }, include: assetInclude }),
    );
  }

  async updateStatus(
    tenantId: string,
    id: string,
    data: { status: string; completedDate?: Date; notes?: string },
  ): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.assetMaintenanceRecord.updateMany({ where: { id, tenantId, status: "Scheduled" }, data }),
    );
    return result.count;
  }
}
