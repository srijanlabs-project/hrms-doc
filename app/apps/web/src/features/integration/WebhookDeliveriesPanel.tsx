import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listWebhookDeliveries } from "../../lib/api/webhooks";

/** Admin-only: recent webhook delivery attempts (up to 200), including retries. 02-webhooks.md v1 slice. */
export function WebhookDeliveriesPanel() {
  const deliveries = useQuery({ queryKey: ["webhook-deliveries"], queryFn: () => listWebhookDeliveries() });

  return (
    <Card title="Delivery Log">
      <ul className="space-y-1">
        {deliveries.data?.map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
            <span>
              {d.eventType} <Badge tone={d.success ? "positive" : "negative"}>{d.success ? "Delivered" : "Failed"}</Badge>
              {d.responseStatus != null && <span className="ml-2 text-xs text-ink-faint">HTTP {d.responseStatus}</span>}
              {d.errorMessage && <span className="ml-2 text-xs text-negative">{d.errorMessage}</span>}
            </span>
            <span className="text-xs text-ink-faint">{new Date(d.attemptedAt).toLocaleString("en-IN")}</span>
          </li>
        ))}
        {deliveries.data?.length === 0 && <p className="text-sm text-ink-faint">No deliveries yet.</p>}
      </ul>
    </Card>
  );
}
