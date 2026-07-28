import { Injectable } from "@nestjs/common";
import type { CandidateAssessment } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

@Injectable()
export class CandidateAssessmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: {
      candidateId: string;
      applicationId?: string;
      type: string;
      score?: number;
      maxScore?: number;
      notes?: string;
      administeredByUserId: string;
    },
  ): Promise<CandidateAssessment> {
    return this.prisma.withTenant(tenantId, (tx) => tx.candidateAssessment.create({ data: { ...data, tenantId } }));
  }

  findForCandidate(tenantId: string, candidateId: string): Promise<CandidateAssessment[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.candidateAssessment.findMany({ where: { tenantId, candidateId }, orderBy: { administeredAt: "desc" } }),
    );
  }
}
