import { Injectable } from "@nestjs/common";
import type { FnfCase, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type FnfCaseWithEmployee = FnfCase & { employee: { id: string; legalName: string; employeeCode: string } };

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.FnfCaseInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class FnfRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.FnfCaseUncheckedCreateInput, "tenantId">): Promise<FnfCaseWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.fnfCase.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findByEmployeeId(tenantId: string, employeeId: string): Promise<FnfCaseWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.fnfCase.findFirst({ where: { tenantId, employeeId }, include: includeEmployee }));
  }

  findById(tenantId: string, id: string): Promise<FnfCaseWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.fnfCase.findFirst({ where: { id, tenantId }, include: includeEmployee }));
  }

  listAll(tenantId: string): Promise<FnfCaseWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.fnfCase.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { calculatedAt: "desc" } }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<Pick<FnfCase, "status" | "approvedByUserId" | "approvedAt" | "releasedAt">>,
  ): Promise<FnfCase> {
    return this.prisma.withTenant(tenantId, (tx) => tx.fnfCase.update({ where: { id }, data }));
  }
}
