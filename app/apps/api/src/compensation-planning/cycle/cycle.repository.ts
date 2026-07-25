import { Injectable } from "@nestjs/common";
import type { CompensationReviewCycle } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CycleRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, periodYear: number): Promise<CompensationReviewCycle> {
    return this.prisma.withTenant(tenantId, (tx) => tx.compensationReviewCycle.create({ data: { tenantId, periodYear } }));
  }

  findAll(tenantId: string): Promise<CompensationReviewCycle[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.compensationReviewCycle.findMany({ where: { tenantId }, orderBy: { periodYear: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<CompensationReviewCycle | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.compensationReviewCycle.findFirst({ where: { id, tenantId } }));
  }

  close(tenantId: string, id: string): Promise<CompensationReviewCycle> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.compensationReviewCycle.update({ where: { id }, data: { status: "Closed" } }),
    );
  }
}
