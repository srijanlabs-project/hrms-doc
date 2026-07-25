import { randomBytes, createHmac } from "node:crypto";
import { Injectable, Logger } from "@nestjs/common";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError, NotFoundAppError } from "../platform/errors/errors";
import type { CreateWebhookSubscriptionDto } from "./dto/create-webhook-subscription.dto";
import { WebhookRepository } from "./webhook.repository";

const DELIVERY_TIMEOUT_MS = 5000;

function sign(secret: string, body: string): string {
  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

/**
 * v1 slice of docs/08-submodule-specifications/27-integration-platform/02-webhooks.md.
 * Collapses webhook_secret_version/webhook_dead_letter into direct fields —
 * no secret rotation history, no dead-letter queue or governed backoff, one
 * immediate retry on failure. dispatch() is called from real mutation points
 * (LeaveRequestService.decide(), ExpenseClaimService.decide(),
 * PayrollRunService.approve()) alongside their existing NotificationService
 * calls, the same "retrofit real call sites" pattern used for the Audit
 * engine. Never throws — a failing webhook must not break the business
 * operation that triggered it.
 */
@Injectable()
export class WebhookDispatchService {
  private readonly logger = new Logger(WebhookDispatchService.name);

  constructor(
    private readonly repository: WebhookRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateWebhookSubscriptionDto) {
    const { tenantId } = this.requireAuthenticated();
    const secret = randomBytes(24).toString("hex");
    return this.repository.create(tenantId, { url: dto.url, eventTypes: dto.eventTypes, secret });
  }

  async list() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listForTenant(tenantId);
  }

  async listDeliveries(subscriptionId?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listDeliveries(tenantId, subscriptionId);
  }

  async disable(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const subscription = await this.repository.findById(tenantId, id);
    if (!subscription) {
      throw new NotFoundAppError("OBJ-WEBHOOK-SUBSCRIPTION", "Webhook subscription not found.");
    }
    return this.repository.setActive(tenantId, id, false);
  }

  /** Called from other services' real mutation points — see this file's top comment for wired call sites. */
  async dispatch(tenantId: string, eventType: string, payload: Record<string, unknown>): Promise<void> {
    let subscriptions;
    try {
      subscriptions = await this.repository.findActiveForEvent(tenantId, eventType);
    } catch (err) {
      this.logger.error(`Failed to look up webhook subscriptions for ${eventType}`, err);
      return;
    }

    for (const subscription of subscriptions) {
      const body = JSON.stringify({ eventType, payload, deliveredAt: new Date().toISOString() });
      const first = await this.attemptDelivery(subscription.url, subscription.secret, body);
      await this.repository.recordDelivery(tenantId, {
        subscriptionId: subscription.id,
        eventType,
        payload: payload as never,
        responseStatus: first.status,
        success: first.success,
        errorMessage: first.error,
      });

      if (!first.success) {
        const retry = await this.attemptDelivery(subscription.url, subscription.secret, body);
        await this.repository.recordDelivery(tenantId, {
          subscriptionId: subscription.id,
          eventType,
          payload: payload as never,
          responseStatus: retry.status,
          success: retry.success,
          errorMessage: retry.error,
        });
      }
    }
  }

  private async attemptDelivery(url: string, secret: string, body: string): Promise<{ success: boolean; status?: number; error?: string }> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Staffsy-Signature": sign(secret, body) },
        body,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return { success: res.ok, status: res.status };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Delivery failed" };
    }
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
