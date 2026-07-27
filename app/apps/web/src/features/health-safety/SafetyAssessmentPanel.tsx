import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { completeSafetyAssessment, createSafetyAssessment, listSafetyAssessments } from "../../lib/api/health-safety";
import { assessmentStatusTone, riskLevelTone } from "./status-tone";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN");
}

/** org_admin/hr_ops: schedule and complete safety audits, risk assessments, and drills. */
export function SafetyAssessmentPanel() {
  const queryClient = useQueryClient();
  const assessments = useQuery({ queryKey: ["safety-assessments"], queryFn: () => listSafetyAssessments() });

  const [type, setType] = useState<"Audit" | "RiskAssessment" | "Drill">("Audit");
  const [location, setLocation] = useState("");
  const [assessedDate, setAssessedDate] = useState("");
  const [findingsById, setFindingsById] = useState<Record<string, string>>({});
  const [riskById, setRiskById] = useState<Record<string, "Low" | "Medium" | "High">>({});

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["safety-assessments"] });
  const createMutation = useMutation({
    mutationFn: () => createSafetyAssessment({ type, location, assessedDate }),
    onSuccess: () => {
      setLocation("");
      setAssessedDate("");
      invalidate();
    },
  });
  const completeMutation = useMutation({
    mutationFn: ({ id, riskLevel, findings }: { id: string; riskLevel: "Low" | "Medium" | "High"; findings?: string }) =>
      completeSafetyAssessment(id, { riskLevel, findings }),
    onSuccess: invalidate,
  });

  return (
    <Card title="Safety Assessments (Audits, Risk Assessments, Drills)">
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
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="input">
          <option value="Audit">Audit</option>
          <option value="RiskAssessment">Risk Assessment</option>
          <option value="Drill">Drill</option>
        </select>
        <input required placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
        <input required type="date" value={assessedDate} onChange={(e) => setAssessedDate(e.target.value)} className="input" />
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Schedule
        </button>
      </form>

      <ul className="space-y-2">
        {assessments.data?.map((a) => (
          <li key={a.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>
                {a.type} — {a.location} <Badge tone={assessmentStatusTone(a.status)}>{a.status}</Badge>{" "}
                {a.status === "Completed" && <Badge tone={riskLevelTone(a.riskLevel)}>{a.riskLevel} risk</Badge>}
              </span>
              <span className="text-xs text-ink-faint">{formatDate(a.assessedDate)}</span>
            </div>
            {a.findings && <p className="mt-1 text-xs text-ink-faint">{a.findings}</p>}
            {a.status === "Scheduled" && (
              <div className="mt-2 flex items-end gap-2">
                <input
                  placeholder="Findings"
                  value={findingsById[a.id] ?? ""}
                  onChange={(e) => setFindingsById((prev) => ({ ...prev, [a.id]: e.target.value }))}
                  className="input w-56"
                />
                <select
                  value={riskById[a.id] ?? "Low"}
                  onChange={(e) => setRiskById((prev) => ({ ...prev, [a.id]: e.target.value as "Low" | "Medium" | "High" }))}
                  className="input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <button
                  type="button"
                  onClick={() =>
                    completeMutation.mutate({ id: a.id, riskLevel: riskById[a.id] ?? "Low", findings: findingsById[a.id] })
                  }
                  className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Complete
                </button>
              </div>
            )}
          </li>
        ))}
        {assessments.data?.length === 0 && <p className="text-sm text-ink-faint">No assessments scheduled.</p>}
      </ul>
    </Card>
  );
}
