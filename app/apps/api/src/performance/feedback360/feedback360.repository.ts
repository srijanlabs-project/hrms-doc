import { Injectable } from "@nestjs/common";
import type { FeedbackCampaign, FeedbackRater, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type RaterWithEmployee = FeedbackRater & { raterEmployee: { id: string; legalName: string } };
export type CampaignWithRaters = FeedbackCampaign & {
  subjectEmployee: { id: string; legalName: string; managerId: string | null };
  raters: RaterWithEmployee[];
};

const includeRaters = {
  subjectEmployee: { select: { id: true, legalName: true, managerId: true } },
  raters: { include: { raterEmployee: { select: { id: true, legalName: true } } } },
} satisfies Prisma.FeedbackCampaignInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class Feedback360Repository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: { subjectEmployeeId: string; cycleYear: number; createdByUserId: string },
  ): Promise<FeedbackCampaign> {
    return this.prisma.withTenant(tenantId, (tx) => tx.feedbackCampaign.create({ data: { ...data, tenantId } }));
  }

  findForSubject(tenantId: string, subjectEmployeeId: string): Promise<CampaignWithRaters[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.feedbackCampaign.findMany({
        where: { tenantId, subjectEmployeeId },
        include: includeRaters,
        orderBy: { cycleYear: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<CampaignWithRaters | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.feedbackCampaign.findFirst({ where: { id, tenantId }, include: includeRaters }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<Pick<FeedbackCampaign, "status" | "closedAt">>,
  ): Promise<FeedbackCampaign> {
    return this.prisma.withTenant(tenantId, (tx) => tx.feedbackCampaign.update({ where: { id }, data }));
  }

  addRater(
    tenantId: string,
    campaignId: string,
    data: { raterEmployeeId: string; category: string },
  ): Promise<FeedbackRater> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.feedbackRater.create({ data: { ...data, campaignId, tenantId } }),
    );
  }

  findRaterById(tenantId: string, id: string): Promise<RaterWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.feedbackRater.findFirst({
        where: { id, tenantId },
        include: { raterEmployee: { select: { id: true, legalName: true } } },
      }),
    );
  }

  /** Pending invitations for a rater across every Open campaign — "my requests" self-service list. */
  findPendingForRater(tenantId: string, raterEmployeeId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.feedbackRater.findMany({
        where: { tenantId, raterEmployeeId, status: "Invited", campaign: { status: "Open" } },
        include: { campaign: { include: { subjectEmployee: { select: { id: true, legalName: true } } } } },
      }),
    );
  }

  submitResponse(
    tenantId: string,
    id: string,
    data: { rating: number; strengths?: string; developmentAreas?: string },
  ): Promise<FeedbackRater> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.feedbackRater.update({
        where: { id },
        data: { ...data, status: "Completed", submittedAt: new Date() },
      }),
    );
  }
}
