import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listMyGrievanceCases, submitGrievanceCase } from "../../lib/api/helpdesk";
import { ApiError } from "../../lib/api/http";
import type { GrievanceCase } from "../../lib/api/types";
import { grievanceStatusTone } from "./status-tone";

const CASE_TYPES: GrievanceCase["caseType"][] = ["Grievance", "Harassment", "Discrimination", "PolicyViolation", "Other"];

/**
 * Self-service: submit a confidential case and track your own cases through
 * resolution. Never visible to general helpdesk agents — only org_admin/hr_ops
 * and you can see it, mirroring TicketService's raiser-or-admin check.
 */
export function MyGrievanceCasesPanel() {
  const queryClient = useQueryClient();
  const cases = useQuery({ queryKey: ["grievance-cases-my"], queryFn: listMyGrievanceCases });

  const [caseType, setCaseType] = useState<GrievanceCase["caseType"]>("Grievance");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const submit = useMutation({
    mutationFn: () => submitGrievanceCase({ caseType, subject, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grievance-cases-my"] });
      setSubject("");
      setDescription("");
    },
  });
  const errorMessage = submit.error instanceof ApiError ? submit.error.message : undefined;

  return (
    <Card title="Employee Relations — My Cases">
      <p className="mb-3 text-xs text-ink-faint">
        Confidential — only HR and you can see what you submit here, never the general helpdesk queue.
      </p>
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 space-y-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit.mutate();
        }}
      >
        <select
          value={caseType}
          onChange={(e) => setCaseType(e.target.value as GrievanceCase["caseType"])}
          className="input"
        >
          {CASE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="input w-full" />
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what happened…"
          className="input w-full"
          rows={3}
        />
        <button
          type="submit"
          disabled={submit.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {submit.isPending ? "Submitting…" : "Submit Case"}
        </button>
      </form>

      <ul className="space-y-2">
        {cases.data?.map((c) => (
          <li key={c.id} className="rounded-lg border border-border p-3">
            <span className="font-medium">{c.caseType}</span> <Badge tone={grievanceStatusTone(c.status)}>{c.status}</Badge>
            <p className="mt-1 text-xs text-ink-faint">{c.subject}</p>
            {c.resolutionSummary && <p className="mt-1 text-xs text-ink-faint">Resolution: {c.resolutionSummary}</p>}
          </li>
        ))}
        {cases.data?.length === 0 && <p className="text-ink-muted">You have no cases on file.</p>}
      </ul>
    </Card>
  );
}
