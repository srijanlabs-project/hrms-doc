import { Injectable } from "@nestjs/common";
import type { Application, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type ApplicationWithCandidate = Application & {
  candidate: { id: string; fullName: string; email: string; source: string };
  offer:
    | {
        id: string;
        status: string;
        monthlyBasic: number;
        joiningDate: Date;
        backgroundCheck: { id: string; checkType: string; status: string; remarks: string | null } | null;
      }
    | null;
};

const includeCandidate = {
  candidate: { select: { id: true, fullName: true, email: true, source: true } },
  offer: {
    select: {
      id: true,
      status: true,
      monthlyBasic: true,
      joiningDate: true,
      backgroundCheck: { select: { id: true, checkType: true, status: true, remarks: true } },
    },
  },
} satisfies Prisma.ApplicationInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, requisitionId: string, candidateId: string): Promise<ApplicationWithCandidate> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.application.create({ data: { tenantId, requisitionId, candidateId }, include: includeCandidate }),
    );
  }

  findForRequisition(tenantId: string, requisitionId: string): Promise<ApplicationWithCandidate[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.application.findMany({
        where: { tenantId, requisitionId },
        include: includeCandidate,
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  /** Org-wide stage counts — used by the Reports module's recruitment-funnel KPI. */
  async countByStage(tenantId: string): Promise<Record<string, number>> {
    const rows = await this.prisma.withTenant(tenantId, (tx) =>
      tx.application.groupBy({ by: ["stage"], where: { tenantId }, _count: { _all: true } }),
    );
    return Object.fromEntries(rows.map((r) => [r.stage, r._count._all]));
  }

  findById(tenantId: string, id: string): Promise<ApplicationWithCandidate | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.application.findFirst({ where: { id, tenantId }, include: includeCandidate }),
    );
  }

  updateStage(
    tenantId: string,
    id: string,
    data: { stage: string; rejectionReason?: string },
  ): Promise<Application> {
    return this.prisma.withTenant(tenantId, (tx) => tx.application.update({ where: { id }, data }));
  }
}
