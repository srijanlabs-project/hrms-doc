import { Injectable } from "@nestjs/common";
import type { TravelRequest, Prisma } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

export type TravelRequestWithEmployee = TravelRequest & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.TravelRequestInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class TravelRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.TravelRequestUncheckedCreateInput, "tenantId">,
  ): Promise<TravelRequestWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelRequest.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findById(tenantId: string, id: string): Promise<TravelRequestWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelRequest.findFirst({ where: { id, tenantId, deletedAt: null }, include: includeEmployee }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<TravelRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelRequest.findMany({
        where: { tenantId, employeeId, deletedAt: null },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  /** Tenant-wide, for org_admin/hr_ops — a request's approver may not be the only one who can act on it. */
  findAll(tenantId: string): Promise<TravelRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelRequest.findMany({
        where: { tenantId, deletedAt: null },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findForApprover(tenantId: string, approverId: string): Promise<TravelRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelRequest.findMany({
        where: { tenantId, approverId, deletedAt: null },
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
      tx.travelRequest.updateMany({
        where: { id, tenantId },
        data: { ...data, decidedAt: new Date() },
      }),
    );
  }

  async cancel(tenantId: string, id: string, employeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.travelRequest.updateMany({
        where: { id, tenantId, employeeId, status: "Pending" },
        data: { status: "Cancelled" },
      }),
    );
    return result.count;
  }

  async markCompleted(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.travelRequest.updateMany({
        where: { id, tenantId, status: "Approved" },
        data: { status: "Completed", completedAt: new Date() },
      }),
    );
    return result.count;
  }
}
