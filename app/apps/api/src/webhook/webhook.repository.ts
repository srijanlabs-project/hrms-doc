import { Injectable } from "@nestjs/common";
import type { Prisma, WebhookDelivery, WebhookSubscription } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class WebhookRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.WebhookSubscriptionUncheckedCreateInput, "tenantId">): Promise<WebhookSubscription> {
    return this.prisma.withTenant(tenantId, (tx) => tx.webhookSubscription.create({ data: { ...data, tenantId } }));
  }

  listForTenant(tenantId: string): Promise<WebhookSubscription[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.webhookSubscription.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<WebhookSubscription | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.webhookSubscription.findFirst({ where: { id, tenantId } }));
  }

  /** Active subscriptions matching this event type or the "*" wildcard. */
  findActiveForEvent(tenantId: string, eventType: string): Promise<WebhookSubscription[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.webhookSubscription.findMany({ where: { tenantId, isActive: true, eventTypes: { hasSome: [eventType, "*"] } } }),
    );
  }

  setActive(tenantId: string, id: string, isActive: boolean): Promise<WebhookSubscription> {
    return this.prisma.withTenant(tenantId, (tx) => tx.webhookSubscription.update({ where: { id }, data: { isActive } }));
  }

  recordDelivery(tenantId: string, data: Omit<Prisma.WebhookDeliveryUncheckedCreateInput, "tenantId">): Promise<WebhookDelivery> {
    return this.prisma.withTenant(tenantId, (tx) => tx.webhookDelivery.create({ data: { ...data, tenantId } }));
  }

  listDeliveries(tenantId: string, subscriptionId?: string): Promise<WebhookDelivery[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.webhookDelivery.findMany({
        where: { tenantId, ...(subscriptionId ? { subscriptionId } : {}) },
        orderBy: { attemptedAt: "desc" },
        take: 200,
      }),
    );
  }
}
