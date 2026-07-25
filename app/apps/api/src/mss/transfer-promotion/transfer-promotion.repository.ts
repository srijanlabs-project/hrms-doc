import { Injectable } from "@nestjs/common";
import type { Prisma, TransferPromotionRequest } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type RequestWithRefs = TransferPromotionRequest & {
  employee: { id: string; legalName: string };
  toDepartment: { id: string; name: string } | null;
  toDesignation: { id: string; title: string } | null;
  toGrade: { id: string; name: string } | null;
};

const includeRefs = {
  employee: { select: { id: true, legalName: true } },
  toDepartment: { select: { id: true, name: true } },
  toDesignation: { select: { id: true, title: true } },
  toGrade: { select: { id: true, name: true } },
} satisfies Prisma.TransferPromotionRequestInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class TransferPromotionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.TransferPromotionRequestUncheckedCreateInput, "tenantId">,
  ): Promise<RequestWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.transferPromotionRequest.create({ data: { ...data, tenantId }, include: includeRefs }),
    );
  }

  findById(tenantId: string, id: string): Promise<RequestWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.transferPromotionRequest.findFirst({ where: { id, tenantId }, include: includeRefs }),
    );
  }

  findByRequester(tenantId: string, requestedByUserId: string): Promise<RequestWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.transferPromotionRequest.findMany({ where: { tenantId, requestedByUserId }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  findAllAdmin(tenantId: string, status?: string): Promise<RequestWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.transferPromotionRequest.findMany({ where: { tenantId, status }, include: includeRefs, orderBy: { createdAt: "desc" } }),
    );
  }

  async transition(
    tenantId: string,
    id: string,
    fromStatuses: string[],
    data: Partial<TransferPromotionRequest>,
  ): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.transferPromotionRequest.updateMany({ where: { id, tenantId, status: { in: fromStatuses } }, data }),
    );
    return result.count;
  }
}
