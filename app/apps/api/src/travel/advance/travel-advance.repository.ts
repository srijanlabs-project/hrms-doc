import { Injectable } from "@nestjs/common";
import type { Prisma, TravelAdvance } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type TravelAdvanceWithEmployee = TravelAdvance & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.TravelAdvanceInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class TravelAdvanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: { travelRequestId: string; employeeId: string; requestedAmount: number },
  ): Promise<TravelAdvanceWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelAdvance.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findById(tenantId: string, id: string): Promise<TravelAdvanceWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelAdvance.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  findForTravelRequest(tenantId: string, travelRequestId: string): Promise<TravelAdvanceWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelAdvance.findMany({ where: { tenantId, travelRequestId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<TravelAdvanceWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelAdvance.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findAllAdmin(tenantId: string): Promise<TravelAdvanceWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelAdvance.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  async decide(
    tenantId: string,
    id: string,
    data: { status: string; approvedAmount?: number; decisionNote?: string; decidedByUserId: string },
  ): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.travelAdvance.updateMany({ where: { id, tenantId, status: "Requested" }, data: { ...data, decidedAt: new Date() } }),
    );
    return result.count;
  }

  async disburse(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.travelAdvance.updateMany({ where: { id, tenantId, status: "Approved" }, data: { status: "Disbursed", disbursedAt: new Date() } }),
    );
    return result.count;
  }
}
