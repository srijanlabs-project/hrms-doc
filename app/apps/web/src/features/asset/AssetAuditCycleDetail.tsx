import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { closeAuditCycle, getAuditCycle, markAuditItemDamaged, markAuditItemMissing, verifyAuditItem } from "../../lib/api/asset-audit";

function findingTone(finding: string): "positive" | "negative" | "warning" | "neutral" {
  if (finding === "Verified") return "positive";
  if (finding === "Missing" || finding === "Damaged") return "negative";
  return "warning";
}

export function AssetAuditCycleDetail({ cycleId, onBack }: { cycleId: string; onBack: () => void }) {
  const queryClient = useQueryClient();
  const cycle = useQuery({ queryKey: ["asset-audit-cycle", cycleId], queryFn: () => getAuditCycle(cycleId) });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["asset-audit-cycle", cycleId] });
    queryClient.invalidateQueries({ queryKey: ["asset-audit-cycles"] });
  };
  const verifyMutation = useMutation({ mutationFn: (itemId: string) => verifyAuditItem(itemId), onSuccess: invalidate });
  const missingMutation = useMutation({ mutationFn: (itemId: string) => markAuditItemMissing(itemId), onSuccess: invalidate });
  const damagedMutation = useMutation({ mutationFn: (itemId: string) => markAuditItemDamaged(itemId), onSuccess: invalidate });
  const closeMutation = useMutation({ mutationFn: () => closeAuditCycle(cycleId), onSuccess: invalidate });

  const pendingCount = cycle.data?.items.filter((i) => i.finding === "Pending").length ?? 0;

  return (
    <Card title={`Audit Cycle — ${cycle.data?.periodLabel ?? ""}`}>
      <button type="button" onClick={onBack} className="mb-3 text-xs text-primary hover:underline">
        ← Back to all cycles
      </button>
      {cycle.data?.status === "Open" && (
        <button
          type="button"
          onClick={() => closeMutation.mutate()}
          disabled={pendingCount > 0 || closeMutation.isPending}
          className="mb-3 ml-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {pendingCount > 0 ? `${pendingCount} pending` : "Close Cycle"}
        </button>
      )}
      <ul className="space-y-2">
        {cycle.data?.items.map((item) => (
          <li key={item.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  {item.asset.category}: {item.asset.name} ({item.asset.assetTag})
                </span>{" "}
                <Badge tone={findingTone(item.finding)}>{item.finding}</Badge>
                <p className="mt-1 text-xs text-ink-faint">
                  Snapshot: {item.statusSnapshot} · {item.assignedToSnapshot ?? "Unassigned"}
                </p>
              </div>
              {item.finding === "Pending" && cycle.data?.status === "Open" && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => verifyMutation.mutate(item.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => missingMutation.mutate(item.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Missing
                  </button>
                  <button
                    type="button"
                    onClick={() => damagedMutation.mutate(item.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Damaged
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
