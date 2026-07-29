import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { ApiError } from "../../lib/api/http";
import { addTestCase, startTestRun, type TestSuite } from "../../lib/api/testing";

export function TestSuiteRow({ suite }: { suite: TestSuite }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [expectedResult, setExpectedResult] = useState("");

  const addCase = useMutation({
    mutationFn: () => addTestCase(suite.id, { title, steps, expectedResult }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-suites"] });
      setTitle("");
      setSteps("");
      setExpectedResult("");
    },
  });
  const startRun = useMutation({
    mutationFn: () => startTestRun(suite.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-suites"] });
      queryClient.invalidateQueries({ queryKey: ["test-runs"] });
    },
  });
  const addCaseError = addCase.error instanceof ApiError ? addCase.error.message : undefined;
  const startRunError = startRun.error instanceof ApiError ? startRun.error.message : undefined;

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">
          {suite.name} <Badge tone="info">{suite.suiteType}</Badge>
        </span>
        <span className="text-xs text-ink-faint">
          {suite.cases.length} case(s) · {suite._count.runs} run(s)
        </span>
      </div>
      {suite.description && <p className="mb-2 text-xs text-ink-faint">{suite.description}</p>}

      <ul className="mb-2 space-y-1">
        {suite.cases.map((c) => (
          <li key={c.id} className="rounded border border-border px-2 py-1 text-xs">
            <span className="font-medium">{c.title}</span> — {c.steps} → {c.expectedResult}
          </li>
        ))}
      </ul>

      {startRunError && <p className="mb-2 rounded-lg bg-negative-soft px-2 py-1 text-xs text-negative">{startRunError}</p>}
      {addCaseError && <p className="mb-2 rounded-lg bg-negative-soft px-2 py-1 text-xs text-negative">{addCaseError}</p>}

      <form
        className="mb-2 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addCase.mutate();
        }}
      >
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Case title" className="input flex-1 basis-32" />
        <input required value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Steps" className="input flex-1 basis-40" />
        <input
          required
          value={expectedResult}
          onChange={(e) => setExpectedResult(e.target.value)}
          placeholder="Expected result"
          className="input flex-1 basis-40"
        />
        <button
          type="submit"
          disabled={addCase.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover disabled:opacity-60"
        >
          Add Case
        </button>
      </form>

      <button
        type="button"
        onClick={() => startRun.mutate()}
        disabled={startRun.isPending || suite.cases.length === 0}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {startRun.isPending ? "Starting…" : "Start Run"}
      </button>
    </li>
  );
}
