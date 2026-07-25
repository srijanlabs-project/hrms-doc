import { Injectable } from "@nestjs/common";
import type { Prisma, Requisition } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type RequisitionWithRefs = Requisition & {
  department: { id: string; name: string } | null;
  hiringManager: { id: string; legalName: string } | null;
};

const includeRefs = {
  department: { select: { id: true, name: true } },
  hiringManager: { select: { id: true, legalName: true } },
} satisfies Prisma.RequisitionInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class RequisitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.RequisitionUncheckedCreateInput, "tenantId">,
  ): Promise<RequisitionWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.requisition.create({ data: { ...data, tenantId }, include: includeRefs }),
    );
  }

  findAll(tenantId: string): Promise<RequisitionWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.requisition.findMany({ where: { tenantId }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<RequisitionWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.requisition.findFirst({ where: { id, tenantId }, include: includeRefs }),
    );
  }

  /** Self-service lookup for the Employee Referrals form — title/headcount only, no compensation or manager detail. */
  findPublished(tenantId: string): Promise<Array<{ id: string; title: string; headcount: number }>> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.requisition.findMany({
        where: { tenantId, status: "Published" },
        select: { id: true, title: true, headcount: true },
        orderBy: { title: "asc" },
      }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<Pick<Requisition, "status" | "approvedByUserId" | "approvedAt" | "publishedAt" | "closedAt">>,
  ): Promise<Requisition> {
    return this.prisma.withTenant(tenantId, (tx) => tx.requisition.update({ where: { id }, data }));
  }
}
