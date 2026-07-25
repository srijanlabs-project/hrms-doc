import { Injectable } from "@nestjs/common";
import type { InterviewFeedback } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class InterviewFeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    interviewRoundId: string,
    data: { rating: number; recommendation: string; comments?: string },
  ): Promise<InterviewFeedback> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.interviewFeedback.create({ data: { tenantId, interviewRoundId, ...data } }),
    );
  }
}
