import { Injectable } from "@nestjs/common";
import type { PerDiemPolicy, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PerDiemPolicyRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.PerDiemPolicyUncheckedCreateInput, "tenantId">): Promise<PerDiemPolicy> {
    return this.prisma.withTenant(tenantId, (tx) => tx.perDiemPolicy.create({ data: { ...data, tenantId } }));
  }

  findActive(tenantId: string): Promise<PerDiemPolicy[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.perDiemPolicy.findMany({ where: { tenantId, active: true }, orderBy: { category: "asc" } }),
    );
  }

  findAll(tenantId: string): Promise<PerDiemPolicy[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.perDiemPolicy.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }));
  }

  findById(tenantId: string, id: string): Promise<PerDiemPolicy | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.perDiemPolicy.findFirst({ where: { id, tenantId } }));
  }
}
