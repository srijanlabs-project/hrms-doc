import { Injectable } from "@nestjs/common";
import type { Notification } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

export interface CreateNotificationInput {
  type: string;
  title: string;
  body: string;
  linkPath?: string;
}

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, userId: string, input: CreateNotificationInput): Promise<Notification> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.notification.create({ data: { tenantId, userId, ...input } }),
    );
  }

  findForUser(tenantId: string, userId: string, take = 20): Promise<Notification[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.notification.findMany({ where: { tenantId, userId }, orderBy: { createdAt: "desc" }, take }),
    );
  }

  countUnread(tenantId: string, userId: string): Promise<number> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.notification.count({ where: { tenantId, userId, readAt: null } }),
    );
  }

  async markRead(tenantId: string, userId: string, id: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.notification.updateMany({ where: { id, tenantId, userId }, data: { readAt: new Date() } }),
    );
  }

  async markAllRead(tenantId: string, userId: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.notification.updateMany({ where: { tenantId, userId, readAt: null }, data: { readAt: new Date() } }),
    );
  }
}
