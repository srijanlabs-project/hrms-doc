import { Injectable } from "@nestjs/common";
import type { KnowledgeArticle, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class KnowledgeArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.KnowledgeArticleUncheckedCreateInput, "tenantId">,
  ): Promise<KnowledgeArticle> {
    return this.prisma.withTenant(tenantId, (tx) => tx.knowledgeArticle.create({ data: { ...data, tenantId } }));
  }

  findPublished(tenantId: string, queue?: string): Promise<KnowledgeArticle[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.knowledgeArticle.findMany({ where: { tenantId, isPublished: true, queue }, orderBy: { createdAt: "desc" } }),
    );
  }

  findAllAdmin(tenantId: string): Promise<KnowledgeArticle[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.knowledgeArticle.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    );
  }
}
