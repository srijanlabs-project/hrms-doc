import { Injectable } from "@nestjs/common";
import type { EmployeeCompensation, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type CompensationWithEmployee = EmployeeCompensation & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.EmployeeCompensationInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CompensationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<CompensationWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeCompensation.findMany({ include: includeEmployee, orderBy: { createdAt: "asc" } }),
    );
  }

  findByEmployeeId(tenantId: string, employeeId: string): Promise<EmployeeCompensation | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.employeeCompensation.findUnique({ where: { employeeId } }));
  }

  findForEmployeeIds(tenantId: string, employeeIds: string[]): Promise<EmployeeCompensation[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeCompensation.findMany({ where: { tenantId, employeeId: { in: employeeIds } } }),
    );
  }

  upsert(
    tenantId: string,
    employeeId: string,
    data: { monthlyBasic: number; effectiveFrom: Date },
  ): Promise<CompensationWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeCompensation.upsert({
        where: { employeeId },
        create: { tenantId, employeeId, ...data },
        update: data,
        include: includeEmployee,
      }),
    );
  }
}
