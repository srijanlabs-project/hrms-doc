import { Injectable } from "@nestjs/common";
import type { AssetAssignment, Prisma } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

export type AssetAssignmentWithRefs = AssetAssignment & {
  employee: { id: string; legalName: string; employeeCode: string };
  asset: { id: string; assetTag: string; category: string; name: string };
};

const includeRefs = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
  asset: { select: { id: true, assetTag: true, category: true, name: true } },
} satisfies Prisma.AssetAssignmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class AssetAssignmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.AssetAssignmentUncheckedCreateInput, "tenantId">,
  ): Promise<AssetAssignmentWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAssignment.create({ data: { ...data, tenantId }, include: includeRefs }),
    );
  }

  findById(tenantId: string, id: string): Promise<AssetAssignmentWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAssignment.findFirst({ where: { id, tenantId, deletedAt: null }, include: includeRefs }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<AssetAssignmentWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAssignment.findMany({
        where: { tenantId, employeeId, deletedAt: null },
        include: includeRefs,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findAll(tenantId: string): Promise<AssetAssignmentWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAssignment.findMany({
        where: { tenantId, deletedAt: null },
        include: includeRefs,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  /** Only succeeds if the assignment is currently Assigned — guards against double-return races. */
  async markReturned(
    tenantId: string,
    id: string,
    data: { returnCondition: string; notes?: string },
  ): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.assetAssignment.updateMany({
        where: { id, tenantId, status: "Assigned" },
        data: { ...data, status: "Returned", returnedAt: new Date() },
      }),
    );
    return result.count;
  }
}
