import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listMyRequests } from "../../lib/api/requests-hub";

const SOURCE_TYPES = ["All", "Leave", "Expense", "Travel"] as const;

function statusTone(status: string): BadgeTone {
  if (status === "Approved" || status === "Completed") return "positive";
  if (status === "Rejected" || status === "Cancelled") return "negative";
  if (status === "Pending") return "warning";
  return "neutral";
}

/**
 * Employee Self Service (E04) — unified Requests hub, 04-requests.md v1
 * slice. Read-only aggregation of Leave/Expense/Travel requests that already
 * exist as real modules — not a new generic request-ticketing entity.
 */
export function RequestsHubPage() {
  const [filter, setFilter] = useState<(typeof SOURCE_TYPES)[number]>("All");
  const requests = useQuery({ queryKey: ["requests-mine"], queryFn: listMyRequests });

  const filtered = requests.data?.filter((r) => filter === "All" || r.sourceType === filter) ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">My Requests</h1>

      <div className="flex gap-1 border-b border-border">
        {SOURCE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={
              filter === type
                ? "border-b-2 border-primary px-4 py-2 font-medium text-primary"
                : "px-4 py-2 font-medium text-ink-muted hover:text-ink"
            }
          >
            {type}
          </button>
        ))}
      </div>

      <Card>
        <ul className="space-y-2">
          {filtered.map((r) => (
            <li key={`${r.sourceType}-${r.id}`}>
              <Link
                to={r.linkPath}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-sm hover:border-primary hover:bg-primary-soft"
              >
                <span>
                  <Badge tone="neutral">{r.sourceType}</Badge> <span className="font-medium">{r.title}</span>
                  <span className="ml-2 text-xs text-ink-faint">
                    {new Date(r.submittedAt).toLocaleDateString("en-IN")}
                  </span>
                </span>
                <Badge tone={statusTone(r.status)}>{r.status}</Badge>
              </Link>
            </li>
          ))}
          {filtered.length === 0 && <p className="text-sm text-ink-faint">No requests yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
