import { Injectable } from "@nestjs/common";
import type { OvertimeRequest, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type OvertimeRequestWithEmployee = OvertimeRequest & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.OvertimeRequestInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class OvertimeRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.OvertimeRequestUncheckedCreateInput, "tenantId">,
  ): Promise<OvertimeRequestWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.overtimeRequest.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findById(tenantId: string, id: string): Promise<OvertimeRequestWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.overtimeRequest.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<OvertimeRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.overtimeRequest.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { date: "desc" } }),
    );
  }

  findForApprover(tenantId: string, approverId: string): Promise<OvertimeRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.overtimeRequest.findMany({
        where: { tenantId, approverId, status: "Pending" },
        include: includeEmployee,
        orderBy: { date: "asc" },
      }),
    );
  }

  findAll(tenantId: string): Promise<OvertimeRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.overtimeRequest.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { date: "desc" } }),
    );
  }

  async decide(
    tenantId: string,
    id: string,
    data: {
      status: string;
      payableAmount?: number;
      compOffDaysCredited?: number;
      decisionNote?: string;
      decidedByUserId: string;
    },
  ): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.overtimeRequest.updateMany({ where: { id, tenantId }, data: { ...data, decidedAt: new Date() } }),
    );
  }
}
