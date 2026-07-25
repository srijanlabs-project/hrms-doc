import { Injectable } from "@nestjs/common";
import type { ComplianceObligation, ComplianceTask, Prisma } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

export type ComplianceTaskWithObligation = ComplianceTask & { obligation: ComplianceObligation };

const includeObligation = { obligation: true } satisfies Prisma.ComplianceTaskInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ComplianceRepository {
  constructor(private readonly prisma: PrismaService) {}

  createObligation(
    tenantId: string,
    data: Omit<Prisma.ComplianceObligationUncheckedCreateInput, "tenantId">,
  ): Promise<ComplianceObligation> {
    return this.prisma.withTenant(tenantId, (tx) => tx.complianceObligation.create({ data: { ...data, tenantId } }));
  }

  findObligationByCode(tenantId: string, code: string): Promise<ComplianceObligation | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.complianceObligation.findFirst({ where: { tenantId, code } }));
  }

  listActiveObligations(tenantId: string): Promise<ComplianceObligation[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.complianceObligation.findMany({ where: { tenantId, isActive: true }, orderBy: { code: "asc" } }),
    );
  }

  listAllObligations(tenantId: string): Promise<ComplianceObligation[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.complianceObligation.findMany({ where: { tenantId }, orderBy: { code: "asc" } }));
  }

  findTaskForPeriod(tenantId: string, obligationId: string, periodLabel: string): Promise<ComplianceTask | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.complianceTask.findFirst({ where: { tenantId, obligationId, periodLabel } }),
    );
  }

  createTask(tenantId: string, data: Omit<Prisma.ComplianceTaskUncheckedCreateInput, "tenantId">): Promise<ComplianceTask> {
    return this.prisma.withTenant(tenantId, (tx) => tx.complianceTask.create({ data: { ...data, tenantId } }));
  }

  listTasks(tenantId: string, status?: string): Promise<ComplianceTaskWithObligation[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.complianceTask.findMany({
        where: { tenantId, ...(status ? { status } : {}) },
        include: includeObligation,
        orderBy: { dueDate: "asc" },
      }),
    );
  }

  findTaskById(tenantId: string, id: string): Promise<ComplianceTaskWithObligation | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.complianceTask.findFirst({ where: { id, tenantId }, include: includeObligation }),
    );
  }

  /** Every Open task past its dueDate — used both by the daily overdue-sweep job and the reminder window check. */
  findOpenTasks(tenantId: string): Promise<ComplianceTaskWithObligation[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.complianceTask.findMany({ where: { tenantId, status: "Open" }, include: includeObligation }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<Pick<ComplianceTask, "status" | "completedByUserId" | "completedAt" | "evidenceFileId" | "note">>,
  ): Promise<ComplianceTask> {
    return this.prisma.withTenant(tenantId, (tx) => tx.complianceTask.update({ where: { id }, data }));
  }
}
