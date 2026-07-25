import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { completeGoal, updateGoalProgress } from "../../lib/api/performance";
import type { Goal } from "../../lib/api/types";
import { goalStatusTone } from "./status-tone";

/** One goal card with inline progress update — used on both the self-service and manager team views. */
export function GoalRow({ goal, readOnly = false }: { goal: Goal; readOnly?: boolean }) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(String(goal.progress));
  const [note, setNote] = useState("");
  const isTerminal = goal.status === "Completed" || goal.status === "Closed";

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["goals-my"] });
    void queryClient.invalidateQueries({ queryKey: ["goals-team"] });
  };

  const progressMutation = useMutation({
    mutationFn: () => updateGoalProgress(goal.id, Number(progress), note || undefined),
    onSuccess: invalidate,
  });
  const completeMutation = useMutation({ mutationFn: () => completeGoal(goal.id), onSuccess: invalidate });

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="font-medium">{goal.title}</div>
          {goal.description && <div className="text-xs text-ink-faint">{goal.description}</div>}
          <div className="text-xs text-ink-faint">
            {goal.periodYear} · Weight {goal.weight}%
          </div>
        </div>
        <Badge tone={goalStatusTone(goal.status)}>{goal.status}</Badge>
      </div>
      <ProgressBar value={goal.progress} />
      {goal.progressNote && <p className="mt-1 text-xs text-ink-faint">{goal.progressNote}</p>}

      {!readOnly && !isTerminal && (
        <form
          className="mt-2 flex flex-wrap items-end gap-2 border-t border-border pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            progressMutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Progress %</span>
            <input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="input w-20"
            />
          </label>
          <label className="block flex-1">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Note</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={progressMutation.isPending}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            Update
          </button>
          <button
            type="button"
            disabled={completeMutation.isPending}
            onClick={() => completeMutation.mutate()}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Mark Complete
          </button>
        </form>
      )}
    </li>
  );
}
