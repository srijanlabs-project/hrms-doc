import { Injectable } from "@nestjs/common";
import type { AnnouncementComment, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type AnnouncementCommentWithEmployee = AnnouncementComment & { employee: { id: string; legalName: string } };

const includeEmployee = {
  employee: { select: { id: true, legalName: true } },
} satisfies Prisma.AnnouncementCommentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class AnnouncementCommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: { announcementId: string; employeeId: string; body: string }): Promise<AnnouncementCommentWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.announcementComment.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findForAnnouncement(tenantId: string, announcementId: string): Promise<AnnouncementCommentWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.announcementComment.findMany({ where: { tenantId, announcementId }, include: includeEmployee, orderBy: { createdAt: "asc" } }),
    );
  }
}
