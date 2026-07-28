import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { createPayoutCycle, listPayoutCycles } from "../../lib/api/compensation-planning";
import { ApiError } from "../../lib/api/http";
import { cycleStatusTone } from "./status-tone";

const PAY_TYPES = ["Bonus", "Incentive"] as const;

export function PayoutCyclesPanel({
  selectedCycleId,
  onSelect,
}: {
  selectedCycleId: string | null;
  onSelect: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const cycles = useQuery({ queryKey: ["payout-cycles"], queryFn: listPayoutCycles });
  const now = new Date();
  const [periodYear, setPeriodYear] = useState(String(now.getUTCFullYear()));
  const [label, setLabel] = useState("");
  const [payType, setPayType] = useState<(typeof PAY_TYPES)[number]>("Bonus");

  const createMutation = useMutation({
    mutationFn: () => createPayoutCycle({ periodYear: Number(periodYear), label, payType }),
    onSuccess: (cycle) => {
      void queryClient.invalidateQueries({ queryKey: ["payout-cycles"] });
      setLabel("");
      onSelect(cycle.id);
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Payout Plan Cycles">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Period Year</span>
          <input
            required
            type="number"
            min="2000"
            value={periodYear}
            onChange={(e) => setPeriodYear(e.target.value)}
            className="input w-24"
          />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Label</span>
          <input
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Diwali bonus 2026"
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Type</span>
          <select value={payType} onChange={(e) => setPayType(e.target.value as typeof payType)} className="input">
            {PAY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
              <span>
                <span className="font-medium">{cycle.label}</span>{" "}
                <span className="text-xs text-ink-faint">
                  ({cycle.periodYear} · {cycle.payType})
                </span>
              </span>
              <Badge tone={cycleStatusTone(cycle.status)}>{cycle.status}</Badge>
            </button>
          </li>
        ))}
      </ul>
      {cycles.data?.length === 0 && <p className="text-ink-muted">No payout cycles yet — create one above.</p>}
    </Card>
  );
}
