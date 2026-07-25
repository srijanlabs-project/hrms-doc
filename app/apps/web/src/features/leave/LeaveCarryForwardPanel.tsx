import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { runLeaveCarryForward } from "../../lib/api/leave";

const currentYear = new Date().getUTCFullYear();

/** Admin-only: year-end carry-forward run — 02-leave-accrual.md's carry-forward requirement. org_admin/hr_ops. */
export function LeaveCarryForwardPanel() {
  const queryClient = useQueryClient();
  const [fromYear, setFromYear] = useState(String(currentYear - 1));
  const [result, setResult] = useState<string | null>(null);

  const carryForwardMutation = useMutation({
    mutationFn: () => runLeaveCarryForward(Number(fromYear)),
    onSuccess: (r) => {
      setResult(
        `Posted ${r.posted} carry-forward entr${r.posted === 1 ? "y" : "ies"} into ${r.toYear} (${r.skippedExisting} already existed).`,
      );
      queryClient.invalidateQueries({ queryKey: ["leave-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  return (
    <Card title="Year-End Carry-Forward">
      <p className="mb-3 text-sm text-ink-muted">
        Computes each active employee's unused balance as of Dec 31 of the selected year, caps it at each leave
        type's carry-forward limit, and posts it into the following year. Safe to re-run — already-run
        employee/leave-type pairs are skipped.
      </p>
      {carryForwardMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{carryForwardMutation.error.message}</p>
      )}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(null);
          carryForwardMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">From year</span>
          <input required type="number" value={fromYear} onChange={(e) => setFromYear(e.target.value)} className="input w-28" />
        </label>
        <button
          type="submit"
          disabled={carryForwardMutation.isPending}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-surface-hover disabled:opacity-60"
        >
          {carryForwardMutation.isPending ? "Running…" : "Run Carry-Forward"}
        </button>
        {result && <span className="text-xs text-ink-faint">{result}</span>}
      </form>
    </Card>
  );
}
