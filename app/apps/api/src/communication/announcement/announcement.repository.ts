import { Injectable } from "@nestjs/common";
import type { Announcement, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class AnnouncementRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.AnnouncementUncheckedCreateInput, "tenantId">,
  ): Promise<Announcement> {
    return this.prisma.withTenant(tenantId, (tx) => tx.announcement.create({ data: { ...data, tenantId } }));
  }

  findById(tenantId: string, id: string): Promise<Announcement | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.announcement.findFirst({ where: { id, tenantId } }));
  }

  findPublished(tenantId: string): Promise<Announcement[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.announcement.findMany({ where: { tenantId, status: "Published" }, orderBy: { publishedAt: "desc" } }),
    );
  }

  findAllAdmin(tenantId: string): Promise<Announcement[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.announcement.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    );
  }

  async publish(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.announcement.updateMany({ where: { id, tenantId, status: "Draft" }, data: { status: "Published", publishedAt: new Date() } }),
    );
    return result.count;
  }

  async archive(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.announcement.updateMany({
        where: { id, tenantId, status: "Published" },
        data: { status: "Archived", archivedAt: new Date() },
      }),
    );
    return result.count;
  }
}
