import { Injectable } from "@nestjs/common";
import type { OnboardingCase, OnboardingTask, Prisma } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";
import { ONBOARDING_TASKS } from "./onboarding-tasks.const";

export type OnboardingCaseWithTasks = OnboardingCase & {
  tasks: OnboardingTask[];
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeCase = {
  tasks: { orderBy: { createdAt: "asc" } },
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.OnboardingCaseInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class OnboardingCaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  createForEmployee(tenantId: string, employeeId: string): Promise<OnboardingCaseWithTasks> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.onboardingCase.create({
        data: {
          tenantId,
          employeeId,
          tasks: { create: ONBOARDING_TASKS.map((t) => ({ tenantId, title: t.title, isBlocking: t.isBlocking })) },
        },
        include: includeCase,
      }),
    );
  }

  findAll(tenantId: string): Promise<OnboardingCaseWithTasks[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.onboardingCase.findMany({ where: { tenantId }, include: includeCase, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<OnboardingCaseWithTasks | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.onboardingCase.findFirst({ where: { id, tenantId }, include: includeCase }),
    );
  }

  findByEmployeeId(tenantId: string, employeeId: string): Promise<OnboardingCaseWithTasks | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.onboardingCase.findFirst({ where: { tenantId, employeeId }, include: includeCase }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<Pick<OnboardingCase, "status" | "activatedAt">>,
  ): Promise<OnboardingCase> {
    return this.prisma.withTenant(tenantId, (tx) => tx.onboardingCase.update({ where: { id }, data }));
  }

  updateTaskStatus(
    tenantId: string,
    taskId: string,
    data: { status: string; completedAt?: Date | null },
  ): Promise<OnboardingTask> {
    return this.prisma.withTenant(tenantId, (tx) => tx.onboardingTask.update({ where: { id: taskId }, data }));
  }

  findTaskById(tenantId: string, taskId: string): Promise<OnboardingTask | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.onboardingTask.findFirst({ where: { id: taskId, tenantId } }));
  }
}
