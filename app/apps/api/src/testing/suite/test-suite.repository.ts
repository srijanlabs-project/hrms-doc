import { Injectable } from "@nestjs/common";
import type { Prisma, TestCase, TestSuite } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type TestSuiteWithCases = TestSuite & { cases: TestCase[]; _count: { runs: number } };

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class TestSuiteRepository {
  constructor(private readonly prisma: PrismaService) {}

  createSuite(tenantId: string, data: Omit<Prisma.TestSuiteUncheckedCreateInput, "tenantId">): Promise<TestSuite> {
    return this.prisma.withTenant(tenantId, (tx) => tx.testSuite.create({ data: { ...data, tenantId } }));
  }

  findAllSuites(tenantId: string): Promise<TestSuiteWithCases[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.testSuite.findMany({
        where: { tenantId },
        include: { cases: { where: { isActive: true }, orderBy: { createdAt: "asc" } }, _count: { select: { runs: true } } },
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findSuiteById(tenantId: string, id: string): Promise<TestSuiteWithCases | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.testSuite.findFirst({
        where: { id, tenantId },
        include: { cases: { where: { isActive: true }, orderBy: { createdAt: "asc" } }, _count: { select: { runs: true } } },
      }),
    );
  }

  createCase(tenantId: string, data: Omit<Prisma.TestCaseUncheckedCreateInput, "tenantId">): Promise<TestCase> {
    return this.prisma.withTenant(tenantId, (tx) => tx.testCase.create({ data: { ...data, tenantId } }));
  }

  findActiveCasesForSuite(tenantId: string, suiteId: string): Promise<TestCase[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.testCase.findMany({ where: { tenantId, suiteId, isActive: true }, orderBy: { createdAt: "asc" } }),
    );
  }
}
