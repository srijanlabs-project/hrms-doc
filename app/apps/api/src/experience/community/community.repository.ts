import { Injectable } from "@nestjs/common";
import type { Community, CommunityMembership, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type CommunityWithMemberCount = Community & { _count: { memberships: number } };

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CommunityRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.CommunityUncheckedCreateInput, "tenantId">): Promise<Community> {
    return this.prisma.withTenant(tenantId, (tx) => tx.community.create({ data: { ...data, tenantId } }));
  }

  findAllActive(tenantId: string): Promise<CommunityWithMemberCount[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.community.findMany({
        where: { tenantId, status: "Active" },
        include: { _count: { select: { memberships: true } } },
        orderBy: { name: "asc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<Community | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.community.findFirst({ where: { id, tenantId } }));
  }

  findMembership(tenantId: string, communityId: string, employeeId: string): Promise<CommunityMembership | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.communityMembership.findFirst({ where: { tenantId, communityId, employeeId } }),
    );
  }

  join(tenantId: string, communityId: string, employeeId: string): Promise<CommunityMembership> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.communityMembership.create({ data: { tenantId, communityId, employeeId } }),
    );
  }

  async leave(tenantId: string, communityId: string, employeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.communityMembership.deleteMany({ where: { tenantId, communityId, employeeId } }),
    );
    return result.count;
  }

  findMyMemberships(tenantId: string, employeeId: string): Promise<CommunityMembership[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.communityMembership.findMany({ where: { tenantId, employeeId } }));
  }
}
