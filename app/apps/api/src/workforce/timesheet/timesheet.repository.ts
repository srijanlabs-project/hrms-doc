import { Injectable } from "@nestjs/common";
import type { Prisma, TimesheetEntry } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type TimesheetEntryWithEmployee = TimesheetEntry & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.TimesheetEntryInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class TimesheetRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.TimesheetEntryUncheckedCreateInput, "tenantId">,
  ): Promise<TimesheetEntryWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.timesheetEntry.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findById(tenantId: string, id: string): Promise<TimesheetEntryWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.timesheetEntry.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<TimesheetEntryWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.timesheetEntry.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { date: "desc" } }),
    );
  }

  findForApprover(tenantId: string, approverId: string): Promise<TimesheetEntryWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.timesheetEntry.findMany({
        where: { tenantId, approverId },
        include: includeEmployee,
        orderBy: { date: "desc" },
      }),
    );
  }

  findAll(tenantId: string): Promise<TimesheetEntryWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.timesheetEntry.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { date: "desc" } }),
    );
  }

  async decide(
    tenantId: string,
    id: string,
    data: { status: string; decisionNote?: string; decidedByUserId: string },
  ): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.timesheetEntry.updateMany({ where: { id, tenantId }, data: { ...data, decidedAt: new Date() } }),
    );
  }

  async cancel(tenantId: string, id: string, employeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.timesheetEntry.updateMany({
        where: { id, tenantId, employeeId, status: "Submitted" },
        data: { status: "Draft" },
      }),
    );
    return result.count;
  }
}
