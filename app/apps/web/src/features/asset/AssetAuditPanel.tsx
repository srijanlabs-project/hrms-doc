import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listAuditCycles, startAuditCycle } from "../../lib/api/asset-audit";
import { AssetAuditCycleDetail } from "./AssetAuditCycleDetail";

/** Wave 4·E18 gap closure ("asset audits") — mirrors Access Reviews' cycle-then-decide pattern. Admin-only. */
export function AssetAuditPanel() {
  const queryClient = useQueryClient();
  const cycles = useQuery({ queryKey: ["asset-audit-cycles"], queryFn: listAuditCycles });
  const [periodLabel, setPeriodLabel] = useState("");
  const [openCycleId, setOpenCycleId] = useState<string | null>(null);

  const startMutation = useMutation({
    mutationFn: () => startAuditCycle(periodLabel),
    onSuccess: (cycle) => {
      queryClient.invalidateQueries({ queryKey: ["asset-audit-cycles"] });
      setPeriodLabel("");
      setOpenCycleId(cycle.id);
    },
  });
  const errorMessage = startMutation.error instanceof ApiError ? startMutation.error.message : undefined;

  if (openCycleId) {
    return <AssetAuditCycleDetail cycleId={openCycleId} onBack={() => setOpenCycleId(null)} />;
  }

  return (
    <Card title="Asset Audits">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          startMutation.mutate();
        }}
      >
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Period Label</span>
          <input
            required
            placeholder="e.g. Q1 2027 Physical Verification"
            value={periodLabel}
            onChange={(e) => setPeriodLabel(e.target.value)}
            className="input"
          />
        </label>
        <button
          type="submit"
          disabled={startMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {startMutation.isPending ? "Starting…" : "Start Audit Cycle"}
        </button>
      </form>
      <ul className="space-y-2">
        {cycles.data?.map((cycle) => (
          <li key={cycle.id} className="rounded-lg border border-border p-3">
            <button type="button" onClick={() => setOpenCycleId(cycle.id)} className="flex w-full items-center justify-between text-left">
              <span>
                <span className="font-medium">{cycle.periodLabel}</span>{" "}
                <Badge tone={cycle.status === "Open" ? "warning" : "positive"}>{cycle.status}</Badge>
              </span>
              <span className="text-xs text-ink-faint">{cycle._count?.items ?? 0} asset(s)</span>
            </button>
          </li>
        ))}
        {cycles.data?.length === 0 && <p className="text-ink-muted">No audit cycles yet.</p>}
      </ul>
    </Card>
  );
}
