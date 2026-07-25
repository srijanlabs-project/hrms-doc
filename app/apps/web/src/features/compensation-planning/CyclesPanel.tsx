import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createCycle, listCycles } from "../../lib/api/compensation-planning";
import { cycleStatusTone } from "./status-tone";

export function CyclesPanel({
  selectedCycleId,
  onSelect,
}: {
  selectedCycleId: string | null;
  onSelect: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const cycles = useQuery({ queryKey: ["compensation-cycles"], queryFn: listCycles });
  const now = new Date();
  const [periodYear, setPeriodYear] = useState(String(now.getUTCFullYear()));

  const createMutation = useMutation({
    mutationFn: () => createCycle(Number(periodYear)),
    onSuccess: (cycle) => {
      void queryClient.invalidateQueries({ queryKey: ["compensation-cycles"] });
      onSelect(cycle.id);
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Review Cycles">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block flex-1">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Period Year</span>
          <input
            required
            type="number"
            min="2000"
            value={periodYear}
            onChange={(e) => setPeriodYear(e.target.value)}
            className="input"
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Creating…" : "New Cycle"}
        </button>
      </form>

      <ul className="space-y-2">
        {cycles.data?.map((cycle) => (
          <li key={cycle.id}>
            <button
              type="button"
              onClick={() => onSelect(cycle.id)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${
                selectedCycleId === cycle.id ? "border-primary bg-primary-soft" : "border-border hover:bg-surface-hover"
              }`}
            >
              <span className="font-medium">{cycle.periodYear}</span>
              <Badge tone={cycleStatusTone(cycle.status)}>{cycle.status}</Badge>
            </button>
          </li>
        ))}
      </ul>
      {cycles.data?.length === 0 && <p className="text-ink-muted">No cycles yet — create one above.</p>}
    </Card>
  );
}
