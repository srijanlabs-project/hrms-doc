import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listTestRuns, recordTestResult, signoffTestRun } from "../../lib/api/testing";

function outcomeTone(outcome: string): "positive" | "negative" | "warning" | "neutral" {
  if (outcome === "Pass") return "positive";
  if (outcome === "Fail" || outcome === "Blocked") return "negative";
  return "neutral";
}

export function TestRunDetail({ runId, onBack }: { runId: string; onBack: () => void }) {
  const queryClient = useQueryClient();
  const runs = useQuery({ queryKey: ["test-runs"], queryFn: listTestRuns });
  const run = runs.data?.find((r) => r.id === runId);

  const [signoffNotes, setSignoffNotes] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["test-runs"] });
  const record = useMutation({
    mutationFn: ({ caseId, outcome }: { caseId: string; outcome: "Pass" | "Fail" | "Blocked" }) =>
      recordTestResult(runId, { caseId, outcome }),
    onSuccess: invalidate,
  });
  const signoff = useMutation({
    mutationFn: (decision: "Approved" | "Rejected") => signoffTestRun(runId, { decision, notes: signoffNotes || undefined }),
    onSuccess: invalidate,
  });
  const recordError = record.error instanceof ApiError ? record.error.message : undefined;
  const signoffError = signoff.error instanceof ApiError ? signoff.error.message : undefined;

  if (!run) return null;

  const canSignoff = ["Passed", "Failed", "Blocked"].includes(run.status);

  return (
    <Card title={`Run — ${run.suite.name}`}>
      <button type="button" onClick={onBack} className="mb-3 text-xs text-primary hover:underline">
        ← Back to all runs
      </button>
      <p className="mb-3 text-sm">
        <Badge tone={run.status === "SignedOff" ? "positive" : "info"}>{run.status}</Badge>
      </p>

      {recordError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{recordError}</p>}
      <ul className="mb-3 space-y-2">
        {run.results.map((result) => (
          <li key={result.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span>
                <span className="font-medium">{result.case.title}</span>{" "}
                <Badge tone={outcomeTone(result.outcome)}>{result.outcome}</Badge>
                <p className="mt-1 text-xs text-ink-faint">
                  {result.case.steps} → {result.case.expectedResult}
                </p>
              </span>
              {run.status === "Running" && result.outcome === "Pending" && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => record.mutate({ caseId: result.caseId, outcome: "Pass" })}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => record.mutate({ caseId: result.caseId, outcome: "Fail" })}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Fail
                  </button>
                  <button
                    type="button"
                    onClick={() => record.mutate({ caseId: result.caseId, outcome: "Blocked" })}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Blocked
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {canSignoff && (
        <div className="border-t border-border pt-3">
          {signoffError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{signoffError}</p>}
          <div className="flex flex-wrap items-end gap-2">
            <input
              value={signoffNotes}
              onChange={(e) => setSignoffNotes(e.target.value)}
              placeholder="Signoff notes"
              className="input flex-1 basis-52"
            />
            <button
              type="button"
              onClick={() => signoff.mutate("Approved")}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Approve (Sign Off)
            </button>
            <button
              type="button"
              onClick={() => signoff.mutate("Rejected")}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {run.status === "SignedOff" && (
        <p className="text-xs text-ink-faint">
          Signed off: <Badge tone={run.signoffDecision === "Approved" ? "positive" : "negative"}>{run.signoffDecision}</Badge>
          {run.signoffNotes && ` — ${run.signoffNotes}`}
        </p>
      )}
    </Card>
  );
}
