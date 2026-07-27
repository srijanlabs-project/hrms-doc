import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createSafetyIncident, listMySafetyIncidents } from "../../lib/api/health-safety";
import { incidentStatusTone, severityTone } from "./status-tone";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN");
}

/** Self-service: report a safety incident and track my own reports. Admin review/resolve/close actions live in SafetyIncidentAdminPanel. */
export function SafetyIncidentPanel() {
  const queryClient = useQueryClient();
  const incidents = useQuery({ queryKey: ["safety-incidents-mine"], queryFn: listMySafetyIncidents });

  const [incidentDate, setIncidentDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["safety-incidents-mine"] });
  const createMutation = useMutation({
    mutationFn: () => createSafetyIncident({ incidentDate, location, description, severity }),
    onSuccess: () => {
      setIncidentDate("");
      setLocation("");
      setDescription("");
      setSeverity("Medium");
      invalidate();
    },
  });

  return (
    <Card title="Report a Safety Incident">
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
        <input required type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} className="input" />
        <input required placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
        <input
          required
          placeholder="What happened?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input w-64"
        />
        <select value={severity} onChange={(e) => setSeverity(e.target.value as typeof severity)} className="input">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Report
        </button>
      </form>

      <h3 className="mb-2 text-sm font-semibold">My Reports</h3>
      <ul className="space-y-2">
        {incidents.data?.map((i) => (
          <li key={i.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>
                {i.location} <Badge tone={severityTone(i.severity)}>{i.severity}</Badge>{" "}
                <Badge tone={incidentStatusTone(i.status)}>{i.status}</Badge>
              </span>
              <span className="text-xs text-ink-faint">{formatDate(i.incidentDate)}</span>
            </div>
            <p className="mt-1 text-xs text-ink-faint">{i.description}</p>
            {i.investigationNotes && (
              <p className="mt-1 text-xs italic text-ink-muted">Investigation: {i.investigationNotes}</p>
            )}
          </li>
        ))}
        {incidents.data?.length === 0 && <p className="text-sm text-ink-faint">No incidents reported yet.</p>}
      </ul>
    </Card>
  );
}
