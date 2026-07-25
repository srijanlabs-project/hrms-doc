import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createCalibrationSession, listCalibrationSessions } from "../../lib/api/performance";

const sessionTone = { Draft: "warning", InSession: "info", Closed: "positive" } as const;

export function CalibrationSessionsPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const sessions = useQuery({ queryKey: ["calibration-sessions"], queryFn: listCalibrationSessions });

  const [periodYear, setPeriodYear] = useState(String(new Date().getUTCFullYear()));
  const [cohortLabel, setCohortLabel] = useState("");

  const create = useMutation({
    mutationFn: () => createCalibrationSession({ periodYear: Number(periodYear), cohortLabel }),
    onSuccess: (session) => {
      void queryClient.invalidateQueries({ queryKey: ["calibration-sessions"] });
      setCohortLabel("");
      onSelect(session.id);
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="Calibration Sessions">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Period Year</span>
          <input
            type="number"
            value={periodYear}
            onChange={(e) => setPeriodYear(e.target.value)}
            className="input w-full"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Cohort Label</span>
          <input
            required
            value={cohortLabel}
            onChange={(e) => setCohortLabel(e.target.value)}
            placeholder="e.g. Engineering"
            className="input w-full"
          />
        </label>
        <button
          type="submit"
          disabled={create.isPending}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {create.isPending ? "Creating…" : "New Session"}
        </button>
      </form>

      <ul className="space-y-1">
        {sessions.data?.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect(s.id)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm ${
                selectedId === s.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary"
              }`}
            >
              <span>
                {s.cohortLabel} · {s.periodYear}
              </span>
              <Badge tone={sessionTone[s.status as keyof typeof sessionTone]}>{s.status}</Badge>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
