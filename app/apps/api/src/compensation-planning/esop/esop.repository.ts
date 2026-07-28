import { Injectable } from "@nestjs/common";
import type { EsopGrant, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type EsopGrantWithEmployee = EsopGrant & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.EsopGrantInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class EsopRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: {
      employeeId: string;
      totalUnits: number;
      grantDate: Date;
      vestingStartDate: Date;
      vestingYears: number;
      cliffMonths?: number;
      exercisePrice?: number;
      createdByUserId: string;
    },
  ): Promise<EsopGrantWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.esopGrant.create({ data: { tenantId, ...data }, include: includeEmployee }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<EsopGrantWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.esopGrant.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { grantDate: "desc" } }),
    );
  }

  findAll(tenantId: string): Promise<EsopGrantWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.esopGrant.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { grantDate: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<EsopGrantWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.esopGrant.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  cancel(tenantId: string, id: string): Promise<EsopGrant> {
    return this.prisma.withTenant(tenantId, (tx) => tx.esopGrant.update({ where: { id }, data: { status: "Cancelled" } }));
  }
}
