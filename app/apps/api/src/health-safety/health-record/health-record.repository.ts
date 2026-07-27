import { Injectable } from "@nestjs/common";
import type { HealthRecord, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type HealthRecordWithEmployee = HealthRecord & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.HealthRecordInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class HealthRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.HealthRecordUncheckedCreateInput, "tenantId">,
  ): Promise<HealthRecordWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.healthRecord.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<HealthRecordWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.healthRecord.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { recordDate: "desc" } }),
    );
  }

  findAll(tenantId: string): Promise<HealthRecordWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.healthRecord.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { recordDate: "desc" } }),
    );
  }
}
