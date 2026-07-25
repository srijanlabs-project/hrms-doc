import { Injectable } from "@nestjs/common";
import type { InterviewRound, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type InterviewRoundWithContext = InterviewRound & {
  interviewer: { id: string; legalName: string };
  feedback: { id: string; rating: number; recommendation: string; comments: string | null } | null;
};

const includeContext = {
  interviewer: { select: { id: true, legalName: true } },
  feedback: { select: { id: true, rating: true, recommendation: true, comments: true } },
} satisfies Prisma.InterviewRoundInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class InterviewRoundRepository {
  constructor(private readonly prisma: PrismaService) {}

  countForApplication(tenantId: string, applicationId: string): Promise<number> {
    return this.prisma.withTenant(tenantId, (tx) => tx.interviewRound.count({ where: { tenantId, applicationId } }));
  }

  create(
    tenantId: string,
    data: Omit<Prisma.InterviewRoundUncheckedCreateInput, "tenantId">,
  ): Promise<InterviewRoundWithContext> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.interviewRound.create({ data: { ...data, tenantId }, include: includeContext }),
    );
  }

  findForApplication(tenantId: string, applicationId: string): Promise<InterviewRoundWithContext[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.interviewRound.findMany({
        where: { tenantId, applicationId },
        include: includeContext,
        orderBy: { roundNumber: "asc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<InterviewRoundWithContext | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.interviewRound.findFirst({ where: { id, tenantId }, include: includeContext }),
    );
  }

  updateStatus(tenantId: string, id: string, status: string): Promise<InterviewRound> {
    return this.prisma.withTenant(tenantId, (tx) => tx.interviewRound.update({ where: { id }, data: { status } }));
  }
}
