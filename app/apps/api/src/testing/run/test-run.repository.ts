import { Injectable } from "@nestjs/common";
import type { Prisma, TestResult, TestRun } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

const resultInclude = {
  case: { select: { id: true, title: true, steps: true, expectedResult: true } },
} satisfies Prisma.TestResultInclude;

export type TestResultWithCase = TestResult & { case: { id: string; title: string; steps: string; expectedResult: string } };

const runInclude = {
  suite: { select: { id: true, name: true, suiteType: true } },
  results: { include: resultInclude, orderBy: { recordedAt: "asc" } },
} satisfies Prisma.TestRunInclude;

export type TestRunWithResults = TestRun & {
  suite: { id: string; name: string; suiteType: string };
  results: TestResultWithCase[];
};

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class TestRunRepository {
  constructor(private readonly prisma: PrismaService) {}

  createRun(
    tenantId: string,
    data: { suiteId: string; executedByUserId: string; caseIds: string[] },
  ): Promise<TestRunWithResults> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.testRun.create({
        data: {
          tenantId,
          suiteId: data.suiteId,
          executedByUserId: data.executedByUserId,
          status: "Running",
          startedAt: new Date(),
          results: { create: data.caseIds.map((caseId) => ({ tenantId, caseId })) },
        },
        include: runInclude,
      }),
    );
  }

  findAll(tenantId: string): Promise<TestRunWithResults[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.testRun.findMany({ where: { tenantId }, include: runInclude, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<TestRunWithResults | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.testRun.findFirst({ where: { id, tenantId }, include: runInclude }));
  }

  async recordResult(tenantId: string, runId: string, caseId: string, outcome: string, notes?: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.testResult.updateMany({ where: { tenantId, runId, caseId }, data: { outcome, notes, recordedAt: new Date() } }),
    );
    return result.count;
  }

  async setRunStatus(tenantId: string, runId: string, status: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.testRun.update({ where: { id: runId }, data: { status, completedAt: new Date() } }),
    );
  }

  async signoff(
    tenantId: string,
    runId: string,
    data: { decision: string; notes?: string; signedOffByUserId: string },
  ): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.testRun.updateMany({
        where: { id: runId, tenantId, status: { in: ["Passed", "Failed", "Blocked"] } },
        data: {
          status: "SignedOff",
          signoffDecision: data.decision,
          signoffNotes: data.notes,
          signedOffByUserId: data.signedOffByUserId,
          signedOffAt: new Date(),
        },
      }),
    );
    return result.count;
  }
}
