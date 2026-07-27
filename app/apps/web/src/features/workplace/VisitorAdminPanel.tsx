import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { approveVisitor, cancelVisitor, checkInVisitor, checkOutVisitor, listAllVisitors } from "../../lib/api/workplace";
import { visitorStatusTone } from "./status-tone";

const STATUSES = ["All", "Requested", "Approved", "CheckedIn", "CheckedOut", "Cancelled", "Expired"] as const;

/** Reception console: every visit across the tenant, with the full state-machine actions. */
export function VisitorAdminPanel() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("All");
  const visitors = useQuery({
    queryKey: ["visitors-all", filter],
    queryFn: () => listAllVisitors(filter === "All" ? undefined : filter),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["visitors-all"] });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveVisitor(id), onSuccess: invalidate });
  const cancelMutation = useMutation({ mutationFn: (id: string) => cancelVisitor(id), onSuccess: invalidate });
  const checkInMutation = useMutation({ mutationFn: (id: string) => checkInVisitor(id), onSuccess: invalidate });
  const checkOutMutation = useMutation({ mutationFn: (id: string) => checkOutVisitor(id), onSuccess: invalidate });

  return (
    <Card title="Reception — All Visits">
      <div className="mb-3 flex gap-1 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-3 py-2 text-sm font-medium ${filter === s ? "border-b-2 border-primary text-primary" : "text-ink-muted"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {visitors.data?.map((v) => (
          <li key={v.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>
                {v.fullName} <span className="text-ink-faint">— hosted by {v.hostEmployee.legalName}</span>{" "}
                <Badge tone={visitorStatusTone(v.status)}>{v.status}</Badge>
              </span>
              <div className="flex gap-2">
                {v.status === "Requested" && (
                  <button type="button" onClick={() => approveMutation.mutate(v.id)} className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover">
                    Approve
                  </button>
                )}
                {v.status === "Approved" && (
                  <button type="button" onClick={() => checkInMutation.mutate(v.id)} className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-hover">
                    Check In
                  </button>
                )}
                {v.status === "CheckedIn" && (
                  <button type="button" onClick={() => checkOutMutation.mutate(v.id)} className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-hover">
                    Check Out
                  </button>
                )}
                {(v.status === "Requested" || v.status === "Approved") && (
                  <button type="button" onClick={() => cancelMutation.mutate(v.id)} className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover">
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-ink-faint">Scheduled {new Date(v.scheduledAt).toLocaleString("en-IN")}</p>
          </li>
        ))}
        {visitors.data?.length === 0 && <p className="text-sm text-ink-faint">No visits match this filter.</p>}
      </ul>
    </Card>
  );
}
