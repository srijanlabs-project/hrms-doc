import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import {
  approvePayrollRun,
  closePayrollRun,
  createPayrollRun,
  listPayrollRuns,
  processPayrollRun,
} from "../../lib/api/payroll";
import { payrollRunStatusTone } from "./status-tone";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Run lifecycle cockpit: Draft -> Processed -> Approved -> Closed (docs/08-submodule-specifications/09-payroll/05-payroll-processing.md, collapsed to 4 states — see schema.prisma PayrollRun comment). */
export function PayrollRunsPanel({
  selectedRunId,
  onSelect,
}: {
  selectedRunId: string | null;
  onSelect: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const runs = useQuery({ queryKey: ["payroll-runs"], queryFn: listPayrollRuns });

  const now = new Date();
  const [periodYear, setPeriodYear] = useState(now.getUTCFullYear());
  const [periodMonth, setPeriodMonth] = useState(now.getUTCMonth() + 1);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["payroll-runs"] });
    void queryClient.invalidateQueries({ queryKey: ["payroll-run"] });
  };

  const createMutation = useMutation({
    mutationFn: () => createPayrollRun(periodYear, periodMonth),
    onSuccess: (run) => {
      invalidate();
      onSelect(run.id);
    },
  });

  const transition = useMutation({
    mutationFn: (input: { id: string; action: "process" | "approve" | "close" }) => {
      if (input.action === "process") return processPayrollRun(input.id);
      if (input.action === "approve") return approvePayrollRun(input.id);
      return closePayrollRun(input.id);
    },
    onSuccess: invalidate,
  });

  const error = createMutation.error ?? transition.error;
  const errorMessage = error instanceof ApiError ? error.message : undefined;

  const nextAction: Record<string, "process" | "approve" | "close" | undefined> = {
    Draft: "process",
    Processed: "approve",
    Approved: "close",
    Closed: undefined,
  };
  const actionLabel: Record<string, string> = { process: "Process", approve: "Approve", close: "Close" };

  return (
    <Card title="Payroll Runs">
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        {errorMessage && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Year</span>
          <input
            required
            type="number"
            value={periodYear}
            onChange={(e) => setPeriodYear(Number(e.target.value))}
            className="input w-24"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Month</span>
          <select
            required
            value={periodMonth}
            onChange={(e) => setPeriodMonth(Number(e.target.value))}
            className="input"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Creating…" : "New Run"}
        </button>
      </form>

      <ul className="space-y-2">
        {runs.data?.map((run) => {
          const action = nextAction[run.status];
          return (
            <li key={run.id}>
              <button
                type="button"
                onClick={() => onSelect(run.id)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left ${
                  selectedRunId === run.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary"
                }`}
              >
                <span className="font-medium">
                  {MONTH_NAMES[run.periodMonth - 1]} {run.periodYear}
                </span>
                <Badge tone={payrollRunStatusTone(run.status)}>{run.status}</Badge>
              </button>
              {action && (
                <button
                  type="button"
                  disabled={transition.isPending}
                  onClick={() => transition.mutate({ id: run.id, action })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
                >
                  {actionLabel[action]}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {runs.data?.length === 0 && <p className="text-ink-muted">No payroll runs yet.</p>}
    </Card>
  );
}
