import { Injectable } from "@nestjs/common";
import type { Prisma, SalaryRevision } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type SalaryRevisionWithEmployee = SalaryRevision & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.SalaryRevisionInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class SalaryRevisionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findForEmployee(tenantId: string, employeeId: string): Promise<SalaryRevisionWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.salaryRevision.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findAll(tenantId: string): Promise<SalaryRevisionWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.salaryRevision.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<SalaryRevisionWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.salaryRevision.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  create(
    tenantId: string,
    data: Omit<Prisma.SalaryRevisionUncheckedCreateInput, "tenantId">,
  ): Promise<SalaryRevisionWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.salaryRevision.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  approve(tenantId: string, id: string, decidedByUserId: string, decisionNote?: string): Promise<SalaryRevision> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.salaryRevision.update({ where: { id }, data: { status: "Approved", decidedByUserId, decisionNote } }),
    );
  }

  reject(tenantId: string, id: string, decidedByUserId: string, decisionNote?: string): Promise<SalaryRevision> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.salaryRevision.update({ where: { id }, data: { status: "Rejected", decidedByUserId, decisionNote } }),
    );
  }

  apply(tenantId: string, id: string): Promise<SalaryRevision> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.salaryRevision.update({ where: { id }, data: { status: "Applied", appliedAt: new Date() } }),
    );
  }
}
