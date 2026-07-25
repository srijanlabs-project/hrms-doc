import { Injectable } from "@nestjs/common";
import type { Prisma, TalentAssessment } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

export type TalentAssessmentWithEmployee = TalentAssessment & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.TalentAssessmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class TalentAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsert(
    tenantId: string,
    employeeId: string,
    periodYear: number,
    data: { performanceRating: number; potentialRating: string; notes?: string },
  ): Promise<TalentAssessmentWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.talentAssessment.upsert({
        where: { tenantId_employeeId_periodYear: { tenantId, employeeId, periodYear } },
        create: { tenantId, employeeId, periodYear, ...data },
        update: data,
        include: includeEmployee,
      }),
    );
  }

  findForPeriod(tenantId: string, periodYear: number): Promise<TalentAssessmentWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.talentAssessment.findMany({
        where: { tenantId, periodYear },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }
}
