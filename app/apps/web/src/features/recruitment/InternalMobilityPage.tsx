import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { applyInternally, listInternalOpenings, listMyInternalApplications } from "../../lib/api/recruitment";
import { applicationStageTone } from "./status-tone";

function formatBand(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  if (min && max) return `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")}`;
  return `₹${(min ?? max)!.toLocaleString("en-IN")}`;
}

/**
 * Internal Mobility — a real catalog gap (no dedicated spec file). Reuses
 * the exact Requisition/Candidate/Application pipeline the external and
 * referral flows already use: `Requisition.isInternal` marks an opening
 * visible here, and applying reuses (or creates once) the employee's own
 * Candidate row rather than a parallel entity.
 */
export function InternalMobilityPage() {
  const queryClient = useQueryClient();
  const openings = useQuery({ queryKey: ["internal-openings"], queryFn: listInternalOpenings });
  const myApplications = useQuery({ queryKey: ["my-internal-applications"], queryFn: listMyInternalApplications });

  const [requisitionId, setRequisitionId] = useState("");

  const applyMutation = useMutation({
    mutationFn: () => applyInternally({ requisitionId }),
    onSuccess: () => {
      setRequisitionId("");
      queryClient.invalidateQueries({ queryKey: ["my-internal-applications"] });
    },
  });
  const errorMessage = applyMutation.error instanceof ApiError ? applyMutation.error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Internal Jobs</h1>
        <p className="text-ink-muted">Explore open roles across the company and apply as an internal candidate.</p>
      </header>

      <Card title="Open Internal Roles">
        {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <ul className="space-y-2">
          {openings.data?.map((r) => {
            const band = formatBand(r.compensationMin, r.compensationMax);
            return (
              <li key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-ink-faint">
                    {r.department?.name ?? "Unassigned department"} · {r.headcount} opening{r.headcount === 1 ? "" : "s"}
                    {band && <> · {band}/mo</>}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={applyMutation.isPending}
                  onClick={() => {
                    setRequisitionId(r.id);
                    applyMutation.mutate();
                  }}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  Apply
                </button>
              </li>
            );
          })}
        </ul>
        {openings.data?.length === 0 && <p className="text-sm text-ink-muted">No internal openings right now.</p>}
      </Card>

      <Card title="My Applications">
        <ul className="space-y-2">
          {myApplications.data?.flatMap((candidate) =>
            candidate.applications.map((app) => (
              <li key={app.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span>{app.requisition.title}</span>
                <Badge tone={applicationStageTone(app.stage)}>{app.stage}</Badge>
              </li>
            )),
          )}
          {(myApplications.data?.length ?? 0) === 0 && <p className="text-sm text-ink-muted">You haven't applied internally yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
