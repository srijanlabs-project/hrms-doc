import { Injectable } from "@nestjs/common";
import type { LeaveRequest, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type LeaveRequestWithEmployee = LeaveRequest & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.LeaveRequestInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class LeaveRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.LeaveRequestUncheckedCreateInput, "tenantId">,
  ): Promise<LeaveRequestWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveRequest.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findById(tenantId: string, id: string): Promise<LeaveRequestWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveRequest.findFirst({ where: { id, tenantId, deletedAt: null }, include: includeEmployee }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<LeaveRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveRequest.findMany({
        where: { tenantId, employeeId, deletedAt: null },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findForApprover(tenantId: string, approverId: string, status?: string): Promise<LeaveRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveRequest.findMany({
        where: { tenantId, approverId, deletedAt: null, ...(status ? { status } : {}) },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  async decide(
    tenantId: string,
    id: string,
    data: { status: string; decisionNote?: string; decidedByUserId: string },
  ): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveRequest.updateMany({
        where: { id, tenantId },
        data: { ...data, decidedAt: new Date() },
      }),
    );
  }

  async cancel(tenantId: string, id: string, employeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveRequest.updateMany({
        where: { id, tenantId, employeeId, status: "Pending" },
        data: { status: "Cancelled" },
      }),
    );
    return result.count;
  }

  /** Org-wide count for a given status — used by the Reports module (e.g. "Pending Approvals"). */
  countByStatus(tenantId: string, status: string): Promise<number> {
    return this.prisma.withTenant(tenantId, (tx) => tx.leaveRequest.count({ where: { tenantId, status } }));
  }

  /** Sums approved days per leave type, for requests overlapping [yearStart, yearEnd]. Used by LeaveBalanceService. */
  async sumApprovedDaysByType(
    tenantId: string,
    employeeId: string,
    yearStart: Date,
    yearEnd: Date,
  ): Promise<Record<string, number>> {
    const rows = await this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveRequest.groupBy({
        by: ["leaveType"],
        where: {
          tenantId,
          employeeId,
          status: "Approved",
          startDate: { lte: yearEnd },
          endDate: { gte: yearStart },
        },
        _sum: { days: true },
      }),
    );
    return Object.fromEntries(rows.map((r) => [r.leaveType, r._sum.days ?? 0]));
  }
}
