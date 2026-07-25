import { Injectable } from "@nestjs/common";
import type { Prisma, ReportingLine } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type ReportingLineWithRefs = ReportingLine & {
  employee: { id: string; legalName: string; employeeCode: string };
  manager: { id: string; legalName: string; employeeCode: string };
};

const includeRefs = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
  manager: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.ReportingLineInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ReportingLineRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<ReportingLineWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.reportingLine.findMany({
        where: { tenantId, deletedAt: null },
        include: includeRefs,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<ReportingLineWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.reportingLine.findFirst({ where: { id, tenantId, deletedAt: null }, include: includeRefs }),
    );
  }

  create(
    tenantId: string,
    data: Omit<Prisma.ReportingLineUncheckedCreateInput, "tenantId">,
  ): Promise<ReportingLineWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.reportingLine.create({ data: { ...data, tenantId }, include: includeRefs }),
    );
  }

  async end(tenantId: string, id: string, endDate: Date): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.reportingLine.updateMany({
        where: { id, tenantId, status: "Active" },
        data: { status: "Ended", endDate },
      }),
    );
    return result.count;
  }
}
