import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listEmployees } from "../../lib/api/employees";
import { listTalentAssessments, upsertTalentAssessment } from "../../lib/api/talent";
import { NineBoxGrid } from "./NineBoxGrid";

/** 9-box only — v1 slice, no review cycles/calibration. Spec: docs/08-submodule-specifications/13-talent-management/02-talent-reviews.md. */
export function TalentGridPage() {
  const queryClient = useQueryClient();
  const now = new Date();
  const periodYear = now.getUTCFullYear();

  const assessments = useQuery({
    queryKey: ["talent-assessments", periodYear],
    queryFn: () => listTalentAssessments(periodYear),
  });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [employeeId, setEmployeeId] = useState("");
  const [performanceRating, setPerformanceRating] = useState("3");
  const [potentialRating, setPotentialRating] = useState("Medium");
  const [notes, setNotes] = useState("");

  const upsertMutation = useMutation({
    mutationFn: () =>
      upsertTalentAssessment({
        employeeId,
        periodYear,
        performanceRating: Number(performanceRating),
        potentialRating,
        notes: notes || undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["talent-assessments", periodYear] });
      setEmployeeId("");
      setNotes("");
    },
  });

  const errorMessage = upsertMutation.error instanceof ApiError ? upsertMutation.error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Talent 9-Box</h1>
        <p className="text-ink-muted">Performance × potential placement for {periodYear}.</p>
      </header>

      <Card title="Place an Employee">
        {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            upsertMutation.mutate();
          }}
        >
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Employee</span>
            <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
              <option value="">Select employee</option>
              {employees.data?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.legalName} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Performance (1-5)</span>
            <select
              value={performanceRating}
              onChange={(e) => setPerformanceRating(e.target.value)}
              className="input w-24"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Potential</span>
            <select value={potentialRating} onChange={(e) => setPotentialRating(e.target.value)} className="input w-32">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Notes</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={upsertMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {upsertMutation.isPending ? "Saving…" : "Save Placement"}
          </button>
        </form>
      </Card>

      <Card title="9-Box Grid">
        <NineBoxGrid assessments={assessments.data ?? []} />
      </Card>
    </div>
  );
}
