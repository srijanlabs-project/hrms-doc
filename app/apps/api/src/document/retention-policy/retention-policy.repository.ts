import { Injectable } from "@nestjs/common";
import type { Prisma, RetentionPolicy } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class RetentionPolicyRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.RetentionPolicyUncheckedCreateInput, "tenantId">): Promise<RetentionPolicy> {
    return this.prisma.withTenant(tenantId, (tx) => tx.retentionPolicy.create({ data: { ...data, tenantId } }));
  }

  findAll(tenantId: string): Promise<RetentionPolicy[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.retentionPolicy.findMany({ where: { tenantId }, orderBy: { name: "asc" } }));
  }
}
