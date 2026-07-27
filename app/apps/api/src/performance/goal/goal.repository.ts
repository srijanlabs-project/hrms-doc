import { Injectable } from "@nestjs/common";
import type { Goal, KeyResult, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type GoalWithKeyResults = Goal & { keyResults: KeyResult[] };

const includeKeyResults = {
  keyResults: { orderBy: { createdAt: "asc" as const } },
} satisfies Prisma.GoalInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class GoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.GoalUncheckedCreateInput, "tenantId">): Promise<Goal> {
    return this.prisma.withTenant(tenantId, (tx) => tx.goal.create({ data: { ...data, tenantId } }));
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<GoalWithKeyResults[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.goal.findMany({ where: { tenantId, employeeId }, include: includeKeyResults, orderBy: { createdAt: "desc" } }),
    );
  }

  findForEmployees(tenantId: string, employeeIds: string[]): Promise<GoalWithKeyResults[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.goal.findMany({
        where: { tenantId, employeeId: { in: employeeIds } },
        include: includeKeyResults,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<GoalWithKeyResults | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.goal.findFirst({ where: { id, tenantId }, include: includeKeyResults }),
    );
  }

  updateProgress(
    tenantId: string,
    id: string,
    data: { progress: number; progressNote?: string },
  ): Promise<Goal> {
    return this.prisma.withTenant(tenantId, (tx) => tx.goal.update({ where: { id }, data }));
  }

  updateStatus(tenantId: string, id: string, status: string): Promise<Goal> {
    return this.prisma.withTenant(tenantId, (tx) => tx.goal.update({ where: { id }, data: { status } }));
  }
}
