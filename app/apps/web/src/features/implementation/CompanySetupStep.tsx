import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { STEP_TEMPLATES, runSetupStep, type SetupStepKey, type StepResult } from "../../lib/api/company-setup";

/** Outcome of the last validate/commit — every failed row is listed, so one bad reference in a 50-row payload is identifiable without re-reading the file. */
function StepOutcome({ result }: { result: StepResult }) {
  const failures = result.results.filter((r) => !r.success);
  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="text-sm">
        <Badge tone={result.failed === 0 ? "positive" : "negative"}>{result.dryRun ? "Dry run" : "Committed"}</Badge>{" "}
        {result.succeeded} of {result.total} row(s) OK
        {result.failed > 0 && <> · {result.failed} failed</>}
      </p>
      {result.dryRun && result.failed === 0 && result.total > 0 && (
        <p className="mt-1 text-xs text-positive">Looks good — Commit is now enabled.</p>
      )}
      {failures.length > 0 && (
        <ul className="mt-2 space-y-1">
          {failures.map((f, i) => (
            <li key={`${f.entity}-${f.code}-${i}`} className="text-xs text-negative">
              <span className="font-medium">
                {f.entity} {f.code}
              </span>{" "}
              — {f.error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CompanySetupStep({
  stepNumber,
  stepKey,
  title,
  description,
  progress,
  locked,
  lockedReason,
}: {
  stepNumber: number;
  stepKey: SetupStepKey;
  title: string;
  description: string;
  progress: string;
  locked: boolean;
  lockedReason?: string;
}) {
  const queryClient = useQueryClient();
  const [text, setText] = useState(STEP_TEMPLATES[stepKey]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<StepResult | null>(null);

  const run = useMutation({
    mutationFn: async (dryRun: boolean) => {
      let payload: unknown;
      try {
        payload = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON — check the payload before running.");
      }
      setParseError(null);
      return runSetupStep(stepKey, payload, dryRun);
    },
    onSuccess: (r) => {
      setResult(r);
      // A committed step changes what later steps can resolve, so refresh the progress counts.
      if (!r.dryRun) queryClient.invalidateQueries({ queryKey: ["company-setup-status"] });
    },
    onError: (err) =>
      setParseError(err instanceof ApiError ? err.payload.message : err instanceof Error ? err.message : "Something went wrong."),
  });

  const cleanDryRun = result?.dryRun === true && result.failed === 0 && result.total > 0;

  return (
    <Card title={`Step ${stepNumber} — ${title}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-[60ch] text-xs text-ink-faint">{description}</p>
        <Badge tone={locked ? "neutral" : "info"}>{progress}</Badge>
      </div>

      {locked ? (
        <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-ink-muted">{lockedReason}</p>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            spellCheck={false}
            className="input w-full font-mono text-xs"
            aria-label={`${title} payload`}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => run.mutate(true)}
              disabled={run.isPending}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover disabled:opacity-60"
            >
              {run.isPending ? "Working…" : "Validate (dry run)"}
            </button>
            <button
              type="button"
              onClick={() => run.mutate(false)}
              disabled={run.isPending || !cleanDryRun}
              title={cleanDryRun ? undefined : "Run a clean dry run first"}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              Commit
            </button>
            <button
              type="button"
              onClick={() => {
                setText(STEP_TEMPLATES[stepKey]);
                setResult(null);
                setParseError(null);
              }}
              className="text-xs text-primary hover:underline"
            >
              Reset to template
            </button>
          </div>

          {parseError && <p className="mt-2 rounded-lg bg-negative-soft px-3 py-2 text-xs text-negative">{parseError}</p>}

          {result && <StepOutcome result={result} />}
        </>
      )}
    </Card>
  );
}
