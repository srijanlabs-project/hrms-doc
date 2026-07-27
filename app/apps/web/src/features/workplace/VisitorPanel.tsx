import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { approveVisitor, cancelVisitor, createVisitor, listMyVisitors } from "../../lib/api/workplace";
import { visitorStatusTone } from "./status-tone";

function money(date: string): string {
  return new Date(date).toLocaleString("en-IN");
}

/** Self-service: register a visitor (host = self) and manage my own visits. Admin actions live in VisitorAdminPanel. */
export function VisitorPanel() {
  const queryClient = useQueryClient();
  const visitors = useQuery({ queryKey: ["visitors-mine"], queryFn: listMyVisitors });

  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [purpose, setPurpose] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["visitors-mine"] });
  const createMutation = useMutation({
    mutationFn: () => createVisitor({ fullName, company: company || undefined, purpose: purpose || undefined, scheduledAt }),
    onSuccess: () => {
      setFullName("");
      setCompany("");
      setPurpose("");
      setScheduledAt("");
      invalidate();
    },
  });
  const cancelMutation = useMutation({ mutationFn: (id: string) => cancelVisitor(id), onSuccess: invalidate });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveVisitor(id), onSuccess: invalidate });

  return (
    <Card title="Register a Visitor">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <input required placeholder="Visitor full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
        <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="input" />
        <input placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="input" />
        <input
          required
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="input"
        />
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Register
        </button>
      </form>

      <h3 className="mb-2 text-sm font-semibold">My Visits</h3>
      <ul className="space-y-2">
        {visitors.data?.map((v) => (
          <li key={v.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>
                {v.fullName} {v.company && <span className="text-ink-faint">({v.company})</span>}{" "}
                <Badge tone={visitorStatusTone(v.status)}>{v.status}</Badge>
              </span>
              <div className="flex gap-2">
                {v.status === "Requested" && (
                  <button
                    type="button"
                    onClick={() => approveMutation.mutate(v.id)}
                    className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Approve
                  </button>
                )}
                {(v.status === "Requested" || v.status === "Approved") && (
                  <button
                    type="button"
                    onClick={() => cancelMutation.mutate(v.id)}
                    className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-ink-faint">Scheduled {money(v.scheduledAt)}</p>
          </li>
        ))}
        {visitors.data?.length === 0 && <p className="text-sm text-ink-faint">No visits registered yet.</p>}
      </ul>
    </Card>
  );
}
