import { Injectable } from "@nestjs/common";
import type { PayoutPlanCycle } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PayoutCycleRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: { periodYear: number; label: string; payType: string; createdByUserId: string },
  ): Promise<PayoutPlanCycle> {
    return this.prisma.withTenant(tenantId, (tx) => tx.payoutPlanCycle.create({ data: { ...data, tenantId } }));
  }

  findAll(tenantId: string): Promise<PayoutPlanCycle[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payoutPlanCycle.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<PayoutPlanCycle | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.payoutPlanCycle.findFirst({ where: { id, tenantId } }));
  }

  close(tenantId: string, id: string): Promise<PayoutPlanCycle> {
    return this.prisma.withTenant(tenantId, (tx) => tx.payoutPlanCycle.update({ where: { id }, data: { status: "Closed" } }));
  }
}
