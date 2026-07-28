import { Injectable } from "@nestjs/common";
import type { FeedComment, FeedLike, FeedPost, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type FeedPostWithDetail = FeedPost & {
  employee: { id: string; legalName: string };
  comments: (FeedComment & { employee: { id: string; legalName: string } })[];
  _count: { likes: number };
};

const includeDetail = {
  employee: { select: { id: true, legalName: true } },
  comments: { include: { employee: { select: { id: true, legalName: true } } }, orderBy: { createdAt: "asc" } },
  _count: { select: { likes: true } },
} satisfies Prisma.FeedPostInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class FeedRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPost(tenantId: string, data: { employeeId: string; body: string; communityId?: string }): Promise<FeedPost> {
    return this.prisma.withTenant(tenantId, (tx) => tx.feedPost.create({ data: { ...data, tenantId } }));
  }

  findFeed(tenantId: string, communityId?: string, limit = 50): Promise<FeedPostWithDetail[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.feedPost.findMany({
        where: { tenantId, communityId: communityId ?? null },
        include: includeDetail,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    );
  }

  findPostById(tenantId: string, id: string): Promise<FeedPost | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.feedPost.findFirst({ where: { id, tenantId } }));
  }

  createComment(tenantId: string, data: { postId: string; employeeId: string; body: string }): Promise<FeedComment> {
    return this.prisma.withTenant(tenantId, (tx) => tx.feedComment.create({ data: { ...data, tenantId } }));
  }

  findLike(tenantId: string, postId: string, employeeId: string): Promise<FeedLike | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.feedLike.findFirst({ where: { tenantId, postId, employeeId } }));
  }

  like(tenantId: string, postId: string, employeeId: string): Promise<FeedLike> {
    return this.prisma.withTenant(tenantId, (tx) => tx.feedLike.create({ data: { tenantId, postId, employeeId } }));
  }

  async unlike(tenantId: string, postId: string, employeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.feedLike.deleteMany({ where: { tenantId, postId, employeeId } }),
    );
    return result.count;
  }
}
