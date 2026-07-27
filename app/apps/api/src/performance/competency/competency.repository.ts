import { Injectable } from "@nestjs/common";
import type { Competency, CompetencyAssessment, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type AssessmentWithCompetency = CompetencyAssessment & { competency: { id: string; name: string } };

const includeCompetency = {
  competency: { select: { id: true, name: true } },
} satisfies Prisma.CompetencyAssessmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CompetencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  createCatalogEntry(tenantId: string, data: { name: string; description?: string }): Promise<Competency> {
    return this.prisma.withTenant(tenantId, (tx) => tx.competency.create({ data: { ...data, tenantId } }));
  }

  findCatalog(tenantId: string): Promise<Competency[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.competency.findMany({ where: { tenantId, isActive: true }, orderBy: { name: "asc" } }),
    );
  }

  findCompetencyById(tenantId: string, id: string): Promise<Competency | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.competency.findFirst({ where: { id, tenantId } }));
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<AssessmentWithCompetency[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.competencyAssessment.findMany({
        where: { tenantId, employeeId },
        include: includeCompetency,
        orderBy: [{ periodYear: "desc" }, { createdAt: "desc" }],
      }),
    );
  }

  upsertAssessment(
    tenantId: string,
    data: {
      employeeId: string;
      competencyId: string;
      periodYear: number;
      rating: number;
      comments?: string;
      assessedByUserId: string;
    },
  ): Promise<AssessmentWithCompetency> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.competencyAssessment.upsert({
        where: {
          tenantId_employeeId_competencyId_periodYear: {
            tenantId,
            employeeId: data.employeeId,
            competencyId: data.competencyId,
            periodYear: data.periodYear,
          },
        },
        create: { ...data, tenantId },
        update: { rating: data.rating, comments: data.comments, assessedByUserId: data.assessedByUserId },
        include: includeCompetency,
      }),
    );
  }
}
