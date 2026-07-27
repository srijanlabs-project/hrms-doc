import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listAccessReviewCycles, startAccessReviewCycle } from "../../lib/api/security";
import { useAuth } from "../auth/AuthProvider";
import { AccessReviewCycleDetail } from "./AccessReviewCycleDetail";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * W0·E29 Security and Governance — periodic access certification. Every
 * Active user's current roles get snapshotted into a cycle; a reviewer
 * confirms or revokes each one. Revoking has a real effect (suspends the
 * user, kills their sessions), not just a paper trail.
 */
export function AccessReviewPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const cycles = useQuery({ queryKey: ["access-review-cycles"], queryFn: listAccessReviewCycles, enabled: isAdmin });
  const [periodLabel, setPeriodLabel] = useState("");
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  const startMutation = useMutation({
    mutationFn: () => startAccessReviewCycle(periodLabel),
    onSuccess: (cycle) => {
      setPeriodLabel("");
      setSelectedCycleId(cycle.id);
      void queryClient.invalidateQueries({ queryKey: ["access-review-cycles"] });
    },
  });
  const startError = startMutation.error instanceof ApiError ? startMutation.error.message : undefined;

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Access reviews are restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Access Reviews</h1>
        <p className="text-ink-muted">Periodic certification of who has access to what, with a real revoke path.</p>
      </header>

      <Card title="Start a Review Cycle">
        {startError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{startError}</p>}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            startMutation.mutate();
          }}
        >
          <input
            required
            placeholder="Period label, e.g. 2026-Q3"
            value={periodLabel}
            onChange={(e) => setPeriodLabel(e.target.value)}
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={startMutation.isPending}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Start Cycle
          </button>
        </form>
      </Card>

      <Card title="Cycles">
        <ul className="space-y-2">
          {cycles.data?.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setSelectedCycleId(c.id)}
                className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left text-sm hover:bg-surface-muted"
              >
                <span>
                  {c.periodLabel} · {c._count?.items ?? 0} item(s)
                </span>
                <Badge tone={c.status === "Open" ? "warning" : "positive"}>{c.status}</Badge>
              </button>
            </li>
          ))}
          {cycles.data?.length === 0 && <p className="text-sm text-ink-faint">No review cycles yet.</p>}
        </ul>
      </Card>

      {selectedCycleId && <AccessReviewCycleDetail cycleId={selectedCycleId} />}
    </div>
  );
}
