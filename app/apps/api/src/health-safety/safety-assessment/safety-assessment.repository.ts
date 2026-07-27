import { Injectable } from "@nestjs/common";
import type { Prisma, SafetyAssessment } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type SafetyAssessmentWithConductor = SafetyAssessment & {
  conductedByEmployee: { id: string; legalName: string; employeeCode: string } | null;
};

const includeConductor = {
  conductedByEmployee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.SafetyAssessmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class SafetyAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.SafetyAssessmentUncheckedCreateInput, "tenantId">,
  ): Promise<SafetyAssessmentWithConductor> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyAssessment.create({ data: { ...data, tenantId }, include: includeConductor }),
    );
  }

  findById(tenantId: string, id: string): Promise<SafetyAssessmentWithConductor | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyAssessment.findFirst({ where: { id, tenantId }, include: includeConductor }),
    );
  }

  findAll(tenantId: string, status?: string): Promise<SafetyAssessmentWithConductor[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyAssessment.findMany({
        where: { tenantId, status },
        include: includeConductor,
        orderBy: { assessedDate: "desc" },
      }),
    );
  }

  async transition(tenantId: string, id: string, fromStatuses: string[], data: Partial<SafetyAssessment>): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyAssessment.updateMany({ where: { id, tenantId, status: { in: fromStatuses } }, data }),
    );
    return result.count;
  }
}
