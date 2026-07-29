import { Injectable } from "@nestjs/common";
import type { GrievanceCase, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type GrievanceCaseWithRefs = GrievanceCase & {
  employee: { id: string; legalName: string };
  assignedHandler: { id: string; legalName: string } | null;
};

const includeRefs = {
  employee: { select: { id: true, legalName: true } },
  assignedHandler: { select: { id: true, legalName: true } },
} satisfies Prisma.GrievanceCaseInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class GrievanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.GrievanceCaseUncheckedCreateInput, "tenantId">,
  ): Promise<GrievanceCaseWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.grievanceCase.create({ data: { ...data, tenantId }, include: includeRefs }),
    );
  }

  findById(tenantId: string, id: string): Promise<GrievanceCaseWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.grievanceCase.findFirst({ where: { id, tenantId }, include: includeRefs }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<GrievanceCaseWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.grievanceCase.findMany({ where: { tenantId, employeeId }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  findAll(tenantId: string): Promise<GrievanceCaseWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.grievanceCase.findMany({ where: { tenantId }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  async assignHandler(tenantId: string, id: string, handlerEmployeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.grievanceCase.updateMany({
        where: { id, tenantId, status: "Received" },
        data: { assignedHandlerId: handlerEmployeeId, status: "UnderInvestigation" },
      }),
    );
    return result.count;
  }

  async resolve(tenantId: string, id: string, resolutionSummary: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.grievanceCase.updateMany({
        where: { id, tenantId, status: { in: ["Received", "UnderInvestigation"] } },
        data: { status: "Resolved", resolutionSummary, resolvedAt: new Date() },
      }),
    );
    return result.count;
  }

  async close(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.grievanceCase.updateMany({
        where: { id, tenantId, status: "Resolved" },
        data: { status: "Closed", closedAt: new Date() },
      }),
    );
    return result.count;
  }
}
