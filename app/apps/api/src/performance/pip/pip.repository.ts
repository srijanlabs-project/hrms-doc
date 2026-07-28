import { Injectable } from "@nestjs/common";
import type { PerformanceImprovementPlan, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type PipWithRefs = PerformanceImprovementPlan & {
  employee: { id: string; legalName: string; employeeCode: string; managerId: string | null };
  objectives: { id: string; title: string; targetDate: Date | null; status: string; completedAt: Date | null }[];
};

const includeRefs = {
  employee: { select: { id: true, legalName: true, employeeCode: true, managerId: true } },
  objectives: { orderBy: { createdAt: "asc" } },
} satisfies Prisma.PerformanceImprovementPlanInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PipRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: { employeeId: string; reason: string; startDate: Date; endDate: Date; createdByUserId: string; objectiveTitles: string[] },
  ): Promise<PipWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.performanceImprovementPlan.create({
        data: {
          tenantId,
          employeeId: data.employeeId,
          reason: data.reason,
          startDate: data.startDate,
          endDate: data.endDate,
          createdByUserId: data.createdByUserId,
          objectives: { create: data.objectiveTitles.map((title) => ({ tenantId, title })) },
        },
        include: includeRefs,
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<PipWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.performanceImprovementPlan.findFirst({ where: { id, tenantId }, include: includeRefs }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<PipWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.performanceImprovementPlan.findMany({ where: { tenantId, employeeId }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  findForEmployees(tenantId: string, employeeIds: string[]): Promise<PipWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.performanceImprovementPlan.findMany({
        where: { tenantId, employeeId: { in: employeeIds } },
        include: includeRefs,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findAllAdmin(tenantId: string): Promise<PipWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.performanceImprovementPlan.findMany({ where: { tenantId }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  findObjectiveById(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.pipObjective.findFirst({ where: { id, tenantId } }));
  }

  completeObjective(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.pipObjective.update({ where: { id }, data: { status: "Completed", completedAt: new Date() } }),
    );
  }

  close(
    tenantId: string,
    id: string,
    data: { status: string; outcomeNotes?: string; closedByUserId: string; closedAt: Date },
  ): Promise<PerformanceImprovementPlan> {
    return this.prisma.withTenant(tenantId, (tx) => tx.performanceImprovementPlan.update({ where: { id }, data }));
  }
}
