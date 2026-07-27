import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createKeyResult, updateKeyResultValue } from "../../lib/api/performance";
import type { Goal } from "../../lib/api/types";

/** OKR key results for one Goal — extracted from GoalRow to keep it under the line limit. */
export function KeyResultList({ goal, readOnly }: { goal: Goal; readOnly: boolean }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["goals-my"] });
    void queryClient.invalidateQueries({ queryKey: ["goals-team"] });
  };

  const addMutation = useMutation({
    mutationFn: () => createKeyResult({ goalId: goal.id, title, targetValue: Number(targetValue), unit: unit || undefined }),
    onSuccess: () => {
      setTitle("");
      setTargetValue("");
      setUnit("");
      invalidate();
    },
  });
  const valueMutation = useMutation({
    mutationFn: ({ id, currentValue }: { id: string; currentValue: number }) => updateKeyResultValue(id, currentValue),
    onSuccess: invalidate,
  });

  return (
    <div className="mt-2 space-y-2 border-t border-border pt-2">
      {goal.keyResults.map((kr) => (
        <div key={kr.id} className="flex items-center justify-between gap-2 text-xs">
          <span>
            {kr.title} — {kr.currentValue}
            {kr.unit} / {kr.targetValue}
            {kr.unit}
          </span>
          {!readOnly && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="Value"
                value={values[kr.id] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [kr.id]: e.target.value }))}
                className="input w-20"
              />
              <button
                type="button"
                disabled={valueMutation.isPending || !values[kr.id]}
                onClick={() => valueMutation.mutate({ id: kr.id, currentValue: Number(values[kr.id]) })}
                className="rounded-lg border border-border px-2 py-1 font-medium hover:border-primary disabled:opacity-50"
              >
                Update
              </button>
            </div>
          )}
        </div>
      ))}

      {!readOnly && (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addMutation.mutate();
          }}
        >
          <input required placeholder="Key result title" value={title} onChange={(e) => setTitle(e.target.value)} className="input flex-1 basis-40 text-xs" />
          <input required type="number" placeholder="Target" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} className="input w-20 text-xs" />
          <input placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="input w-16 text-xs" />
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:border-primary disabled:opacity-50"
          >
            + Key Result
          </button>
        </form>
      )}
    </div>
  );
}
