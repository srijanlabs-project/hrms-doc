import { Injectable } from "@nestjs/common";
import type { KeyResult, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class KeyResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.KeyResultUncheckedCreateInput, "tenantId">): Promise<KeyResult> {
    return this.prisma.withTenant(tenantId, (tx) => tx.keyResult.create({ data: { ...data, tenantId } }));
  }

  findById(tenantId: string, id: string): Promise<KeyResult | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.keyResult.findFirst({ where: { id, tenantId } }));
  }

  findForGoal(tenantId: string, goalId: string): Promise<KeyResult[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.keyResult.findMany({ where: { tenantId, goalId }, orderBy: { createdAt: "asc" } }),
    );
  }

  updateValue(tenantId: string, id: string, currentValue: number): Promise<KeyResult> {
    return this.prisma.withTenant(tenantId, (tx) => tx.keyResult.update({ where: { id }, data: { currentValue } }));
  }
}
