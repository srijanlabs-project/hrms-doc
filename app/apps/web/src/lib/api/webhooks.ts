import { apiRequest } from "./http";
import type { CreateWebhookSubscriptionInput, WebhookDelivery, WebhookSubscription } from "./types";

export function listWebhookSubscriptions(): Promise<WebhookSubscription[]> {
  return apiRequest<WebhookSubscription[]>("/integration/webhooks/subscriptions");
}

export function createWebhookSubscription(input: CreateWebhookSubscriptionInput): Promise<WebhookSubscription> {
  return apiRequest<WebhookSubscription>("/integration/webhooks/subscriptions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function disableWebhookSubscription(id: string): Promise<WebhookSubscription> {
  return apiRequest<WebhookSubscription>(`/integration/webhooks/subscriptions/${id}/disable`, { method: "POST" });
}

export function listWebhookDeliveries(subscriptionId?: string): Promise<WebhookDelivery[]> {
  const query = subscriptionId ? `?subscriptionId=${encodeURIComponent(subscriptionId)}` : "";
  return apiRequest<WebhookDelivery[]>(`/integration/webhooks/deliveries${query}`);
}
