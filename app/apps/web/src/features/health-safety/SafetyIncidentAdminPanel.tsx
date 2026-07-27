import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { closeSafetyIncident, listAllSafetyIncidents, resolveSafetyIncident, reviewSafetyIncident } from "../../lib/api/health-safety";
import { incidentStatusTone, severityTone } from "./status-tone";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN");
}

/** org_admin/hr_ops: review, resolve, and close reported safety incidents. */
export function SafetyIncidentAdminPanel() {
  const queryClient = useQueryClient();
  const incidents = useQuery({ queryKey: ["safety-incidents-all"], queryFn: () => listAllSafetyIncidents() });
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["safety-incidents-all"] });
    queryClient.invalidateQueries({ queryKey: ["safety-incidents-mine"] });
  };
  const reviewMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => reviewSafetyIncident(id, notes),
    onSuccess: invalidate,
  });
  const resolveMutation = useMutation({ mutationFn: (id: string) => resolveSafetyIncident(id), onSuccess: invalidate });
  const closeMutation = useMutation({ mutationFn: (id: string) => closeSafetyIncident(id), onSuccess: invalidate });

  return (
    <Card title="Incident Review Queue">
      <ul className="space-y-2">
        {incidents.data?.map((i) => (
          <li key={i.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>
                {i.location} — {i.reportedByEmployee.legalName} <Badge tone={severityTone(i.severity)}>{i.severity}</Badge>{" "}
                <Badge tone={incidentStatusTone(i.status)}>{i.status}</Badge>
              </span>
              <span className="text-xs text-ink-faint">{formatDate(i.incidentDate)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-faint">{i.description}</p>
            {i.investigationNotes && (
              <p className="mt-1 text-xs italic text-ink-muted">Investigation: {i.investigationNotes}</p>
            )}

            {(i.status === "Reported" || i.status === "UnderReview") && (
              <div className="mt-2 flex items-end gap-2">
                <input
                  placeholder="Investigation notes"
                  value={notesById[i.id] ?? ""}
                  onChange={(e) => setNotesById((prev) => ({ ...prev, [i.id]: e.target.value }))}
                  className="input w-64"
                />
                <button
                  type="button"
                  onClick={() => reviewMutation.mutate({ id: i.id, notes: notesById[i.id] ?? "" })}
                  disabled={!notesById[i.id]}
                  className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
                >
                  Save Notes
                </button>
              </div>
            )}
            <div className="mt-2 flex gap-2">
              {i.status === "UnderReview" && (
                <button
                  type="button"
                  onClick={() => resolveMutation.mutate(i.id)}
                  className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
                >
                  Resolve
                </button>
              )}
              {i.status === "Resolved" && (
                <button
                  type="button"
                  onClick={() => closeMutation.mutate(i.id)}
                  className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
                >
                  Close
                </button>
              )}
            </div>
          </li>
        ))}
        {incidents.data?.length === 0 && <p className="text-sm text-ink-faint">No incidents reported.</p>}
      </ul>
    </Card>
  );
}
