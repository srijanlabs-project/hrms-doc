import { Injectable } from "@nestjs/common";
import type { CareerPlan, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type CareerPlanWithRefs = CareerPlan & {
  employee: { id: string; legalName: string; employeeCode: string; managerId: string | null };
  targetDesignation: { id: string; title: string } | null;
  actions: { id: string; title: string; status: string; completedAt: Date | null }[];
};

const includeRefs = {
  employee: { select: { id: true, legalName: true, employeeCode: true, managerId: true } },
  targetDesignation: { select: { id: true, title: true } },
  actions: { orderBy: { createdAt: "asc" } },
} satisfies Prisma.CareerPlanInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CareerPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: {
      employeeId: string;
      targetDesignationId?: string;
      timeframeYears?: number;
      developmentNotes: string;
      actionTitles: string[];
    },
  ): Promise<CareerPlanWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.careerPlan.create({
        data: {
          tenantId,
          employeeId: data.employeeId,
          targetDesignationId: data.targetDesignationId,
          timeframeYears: data.timeframeYears,
          developmentNotes: data.developmentNotes,
          actions: { create: data.actionTitles.map((title) => ({ tenantId, title })) },
        },
        include: includeRefs,
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<CareerPlanWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.careerPlan.findFirst({ where: { id, tenantId }, include: includeRefs }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<CareerPlanWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.careerPlan.findMany({ where: { tenantId, employeeId }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  findForEmployees(tenantId: string, employeeIds: string[]): Promise<CareerPlanWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.careerPlan.findMany({
        where: { tenantId, employeeId: { in: employeeIds } },
        include: includeRefs,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findAllAdmin(tenantId: string): Promise<CareerPlanWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.careerPlan.findMany({ where: { tenantId }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  updateStatus(tenantId: string, id: string, status: string): Promise<CareerPlan> {
    return this.prisma.withTenant(tenantId, (tx) => tx.careerPlan.update({ where: { id }, data: { status } }));
  }

  addAction(tenantId: string, planId: string, title: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.careerPlanAction.create({ data: { tenantId, planId, title } }));
  }

  findActionById(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.careerPlanAction.findFirst({ where: { id, tenantId } }));
  }

  completeAction(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.careerPlanAction.update({ where: { id }, data: { status: "Completed", completedAt: new Date() } }),
    );
  }
}
