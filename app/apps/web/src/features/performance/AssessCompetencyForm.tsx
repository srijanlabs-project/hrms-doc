import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { assessCompetency } from "../../lib/api/performance";
import type { Competency } from "../../lib/api/types";
import type { TeamRosterMember } from "../../lib/api/team-dashboard";

/** Manager rates one direct report against the competency catalog — extracted from CompetenciesPage to keep it under the line limit. */
export function AssessCompetencyForm({ roster, catalog }: { roster: TeamRosterMember[]; catalog: Competency[] }) {
  const queryClient = useQueryClient();
  const now = new Date();

  const [employeeId, setEmployeeId] = useState("");
  const [competencyId, setCompetencyId] = useState("");
  const [rating, setRating] = useState("3");
  const [comments, setComments] = useState("");

  const assessMutation = useMutation({
    mutationFn: () =>
      assessCompetency({
        employeeId,
        competencyId,
        periodYear: now.getUTCFullYear(),
        rating: Number(rating),
        comments: comments || undefined,
      }),
    onSuccess: () => {
      setComments("");
      void queryClient.invalidateQueries({ queryKey: ["competency-assessments-mine"] });
    },
  });
  const assessError = assessMutation.error instanceof ApiError ? assessMutation.error.message : undefined;

  return (
    <Card title="Rate a Direct Report">
      {assessError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{assessError}</p>}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          assessMutation.mutate();
        }}
      >
        <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
          <option value="">Select employee…</option>
          {roster.map((m) => (
            <option key={m.id} value={m.id}>
              {m.legalName}
            </option>
          ))}
        </select>
        <select required value={competencyId} onChange={(e) => setCompetencyId(e.target.value)} className="input">
          <option value="">Select competency…</option>
          {catalog.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="input w-20">
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <input placeholder="Comments" value={comments} onChange={(e) => setComments(e.target.value)} className="input flex-1" />
        <button
          type="submit"
          disabled={assessMutation.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          Submit Rating
        </button>
      </form>
    </Card>
  );
}
