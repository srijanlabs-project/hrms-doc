import { Injectable } from "@nestjs/common";
import type { IncentiveBonus, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type IncentiveBonusWithEmployee = IncentiveBonus & { employee: { id: string; legalName: string } };

const includeEmployee = { employee: { select: { id: true, legalName: true } } } satisfies Prisma.IncentiveBonusInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class IncentiveBonusRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.IncentiveBonusUncheckedCreateInput, "tenantId">): Promise<IncentiveBonusWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) => tx.incentiveBonus.create({ data: { ...data, tenantId }, include: includeEmployee }));
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<IncentiveBonusWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.incentiveBonus.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findAll(tenantId: string): Promise<IncentiveBonusWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.incentiveBonus.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }
}
