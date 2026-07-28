import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { TrendBarChart } from "../analytics/TrendBarChart";
import { ApiError } from "../../lib/api/http";
import { adjustCalibrationCase, closeCalibrationSession, generateCalibrationCases, getCalibrationSession } from "../../lib/api/performance";
import type { CalibrationCase } from "../../lib/api/types";

const RATINGS = [1, 2, 3, 4, 5];

/** W3·E11 "bell curve" gap closure — a real rating-distribution histogram over this session's own cases, before and after calibration. No forced-ranking/guidance-band enforcement: the spec explicitly forbids silently auto-editing ratings. */
function DistributionChart({ cases }: { cases: CalibrationCase[] }) {
  if (cases.length === 0) return null;
  const originalBars = RATINGS.map((r) => ({ label: String(r), value: cases.filter((c) => c.originalRating === r).length }));
  const calibratedBars = RATINGS.map((r) => ({
    label: String(r),
    value: cases.filter((c) => (c.calibratedRating ?? c.originalRating) === r).length,
  }));

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 rounded-lg border border-border p-3 sm:grid-cols-2">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">Original Rating Distribution</p>
        <TrendBarChart bars={originalBars} />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">Calibrated Rating Distribution</p>
        <TrendBarChart bars={calibratedBars} />
      </div>
    </div>
  );
}

function CaseRow({ calibrationCase, sessionId }: { calibrationCase: CalibrationCase; sessionId: string }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(String(calibrationCase.calibratedRating ?? calibrationCase.originalRating));
  const [rationale, setRationale] = useState(calibrationCase.rationale ?? "");

  const adjust = useMutation({
    mutationFn: () => adjustCalibrationCase(calibrationCase.id, Number(rating), rationale || undefined),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["calibration-session", sessionId] }),
  });
  const errorMessage = adjust.error instanceof ApiError ? adjust.error.message : undefined;

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {calibrationCase.employee.legalName} ({calibrationCase.employee.employeeCode})
        </span>
        <span className="text-sm text-ink-muted">Original: {calibrationCase.originalRating}/5</span>
      </div>
      {errorMessage && <p className="mt-1 text-xs text-negative">{errorMessage}</p>}
      <form
        className="mt-2 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          adjust.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Calibrated Rating</span>
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="input w-24 text-xs">
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Rationale (required if changed)</span>
          <input value={rationale} onChange={(e) => setRationale(e.target.value)} className="input w-full text-xs" />
        </label>
        <button
          type="submit"
          disabled={adjust.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          {calibrationCase.decidedAt ? "Update" : "Confirm"}
        </button>
        {calibrationCase.decidedAt && <Badge tone="positive">Decided</Badge>}
      </form>
    </li>
  );
}

export function CalibrationSessionDetail({ sessionId }: { sessionId: string }) {
  const queryClient = useQueryClient();
  const session = useQuery({ queryKey: ["calibration-session", sessionId], queryFn: () => getCalibrationSession(sessionId) });

  const generate = useMutation({
    mutationFn: () => generateCalibrationCases(sessionId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["calibration-session", sessionId] }),
  });
  const close = useMutation({
    mutationFn: () => closeCalibrationSession(sessionId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["calibration-session", sessionId] }),
  });
  const errorMessage =
    generate.error instanceof ApiError ? generate.error.message : close.error instanceof ApiError ? close.error.message : undefined;

  if (!session.data) return null;

  return (
    <Card
      title={`${session.data.cohortLabel} — ${session.data.periodYear}`}
      action={
        <div className="flex items-center gap-2">
          {session.data.status === "Draft" && (
            <button
              type="button"
              disabled={generate.isPending}
              onClick={() => generate.mutate()}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {generate.isPending ? "Generating…" : "Generate Cases"}
            </button>
          )}
          {session.data.status === "InSession" && (
            <button
              type="button"
              disabled={close.isPending}
              onClick={() => close.mutate()}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
            >
              {close.isPending ? "Closing…" : "Close Session"}
            </button>
          )}
        </div>
      }
    >
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      {session.data.cases.length === 0 && (
        <p className="text-ink-muted">No cases yet — generate cases from finalized appraisals for this period.</p>
      )}
      <DistributionChart cases={session.data.cases} />
      <ul className="space-y-2">
        {session.data.cases.map((c) => (
          <CaseRow key={c.id} calibrationCase={c} sessionId={sessionId} />
        ))}
      </ul>
    </Card>
  );
}
