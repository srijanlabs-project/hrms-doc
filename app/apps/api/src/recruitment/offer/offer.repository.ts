import { Injectable } from "@nestjs/common";
import type { Offer, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type OfferWithContext = Offer & {
  application: {
    id: string;
    requisitionId: string;
    candidate: { id: string; fullName: string; email: string };
    requisition: { id: string; title: string; departmentId: string | null; hiringManagerId: string | null };
  };
  backgroundCheck: { id: string; checkType: string; status: string; remarks: string | null } | null;
};

const includeContext = {
  application: {
    include: {
      candidate: { select: { id: true, fullName: true, email: true } },
      requisition: { select: { id: true, title: true, departmentId: true, hiringManagerId: true } },
    },
  },
  backgroundCheck: { select: { id: true, checkType: true, status: true, remarks: true } },
} satisfies Prisma.OfferInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class OfferRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    applicationId: string,
    data: { monthlyBasic: number; joiningDate: Date },
  ): Promise<OfferWithContext> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.offer.create({ data: { tenantId, applicationId, ...data }, include: includeContext }),
    );
  }

  findAll(tenantId: string): Promise<OfferWithContext[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.offer.findMany({ where: { tenantId }, include: includeContext, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<OfferWithContext | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.offer.findFirst({ where: { id, tenantId }, include: includeContext }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<
      Pick<
        Offer,
        | "status"
        | "approvedByUserId"
        | "approvedAt"
        | "issuedAt"
        | "respondedAt"
        | "declineReason"
        | "convertedEmployeeId"
      >
    >,
  ): Promise<Offer> {
    return this.prisma.withTenant(tenantId, (tx) => tx.offer.update({ where: { id }, data }));
  }
}
