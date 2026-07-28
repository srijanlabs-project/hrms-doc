import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { createCandidateAssessment, listCandidateAssessments } from "../../lib/api/recruitment";

const ASSESSMENT_TYPES = ["Technical", "Aptitude", "Behavioral", "Other"];

/** W3·E06 Recruitment and ATS gap closure — pre-hire candidate assessments, distinct from employee performance/competency assessments. */
export function AssessmentSection({ candidateId, applicationId }: { candidateId: string; applicationId: string }) {
  const queryClient = useQueryClient();
  const assessments = useQuery({
    queryKey: ["candidate-assessments", candidateId],
    queryFn: () => listCandidateAssessments(candidateId),
  });

  const [type, setType] = useState("Technical");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [notes, setNotes] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createCandidateAssessment(candidateId, {
        applicationId,
        type,
        score: score ? Number(score) : undefined,
        maxScore: maxScore ? Number(maxScore) : undefined,
        notes: notes || undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["candidate-assessments", candidateId] });
      setScore("");
      setMaxScore("");
      setNotes("");
    },
  });

  return (
    <div className="mt-3 rounded-lg border border-dashed border-border p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Assessments</p>
      <ul className="mb-2 space-y-1">
        {assessments.data?.map((a) => (
          <li key={a.id} className="text-sm">
            <Badge tone="info">{a.type}</Badge>{" "}
            {a.score !== null && (
              <span className="font-mono text-xs">
                {a.score}
                {a.maxScore !== null ? `/${a.maxScore}` : ""}
              </span>
            )}
            {a.notes && <span className="ml-2 text-xs text-ink-muted">{a.notes}</span>}
          </li>
        ))}
        {assessments.data?.length === 0 && <p className="text-xs text-ink-faint">No assessments recorded yet.</p>}
      </ul>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <select value={type} onChange={(e) => setType(e.target.value)} className="input w-32">
          {ASSESSMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} className="input w-20" />
        <input placeholder="Max" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="input w-20" />
        <input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="input flex-1 basis-32" />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          {createMutation.isPending ? "Saving…" : "Record"}
        </button>
      </form>
    </div>
  );
}
