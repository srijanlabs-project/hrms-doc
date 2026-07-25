import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createWebhookSubscription, disableWebhookSubscription, listWebhookSubscriptions } from "../../lib/api/webhooks";

const EVENT_TYPES = [
  "*",
  "leave.request.approved",
  "leave.request.rejected",
  "expense.claim.approved",
  "expense.claim.rejected",
  "payroll.run.approved",
];

/** Admin-only: outbound webhook subscriptions. 02-webhooks.md v1 slice. */
export function WebhookSubscriptionsPanel() {
  const queryClient = useQueryClient();
  const subscriptions = useQuery({ queryKey: ["webhook-subscriptions"], queryFn: listWebhookSubscriptions });

  const [url, setUrl] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>(["*"]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["webhook-subscriptions"] });
  const createMutation = useMutation({
    mutationFn: () => createWebhookSubscription({ url, eventTypes }),
    onSuccess: () => {
      setUrl("");
      invalidate();
    },
  });
  const disableMutation = useMutation({ mutationFn: (id: string) => disableWebhookSubscription(id), onSuccess: invalidate });

  const toggleEventType = (eventType: string) => {
    setEventTypes((prev) => (prev.includes(eventType) ? prev.filter((e) => e !== eventType) : [...prev, eventType]));
  };

  return (
    <Card title="Webhook Subscriptions">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-4 space-y-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <div className="flex flex-wrap items-end gap-2">
          <input
            required
            type="url"
            placeholder="https://your-endpoint.example.com/hook"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input flex-1 basis-64"
          />
          <button
            type="submit"
            disabled={createMutation.isPending || eventTypes.length === 0}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Register Webhook
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((eventType) => (
            <label key={eventType} className="flex items-center gap-1 text-xs text-ink-muted">
              <input type="checkbox" checked={eventTypes.includes(eventType)} onChange={() => toggleEventType(eventType)} />
              {eventType}
            </label>
          ))}
        </div>
      </form>

      <ul className="space-y-2">
        {subscriptions.data?.map((s) => (
          <li key={s.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="break-all">{s.url}</span>
              <div className="flex items-center gap-2">
                <Badge tone={s.isActive ? "positive" : "neutral"}>{s.isActive ? "Active" : "Disabled"}</Badge>
                {s.isActive && (
                  <button type="button" onClick={() => disableMutation.mutate(s.id)} className="text-xs text-negative hover:underline">
                    Disable
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              Events: {s.eventTypes.join(", ")} · Secret: <span className="font-mono">{s.secret}</span>
            </p>
          </li>
        ))}
        {subscriptions.data?.length === 0 && <p className="text-sm text-ink-faint">No webhooks registered yet.</p>}
      </ul>
    </Card>
  );
}
