import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { getMyRewardBalance, listMyRedemptions, listRewardCatalog, redeemReward } from "../../lib/api/experience";
import { ApiError } from "../../lib/api/http";

function redemptionTone(status: string): "positive" | "warning" | "neutral" {
  if (status === "Fulfilled") return "positive";
  if (status === "Requested") return "warning";
  return "neutral";
}

/** Self-service: a redemption catalog behind Recognition's existing points counter. */
export function RewardsPanel() {
  const queryClient = useQueryClient();
  const balance = useQuery({ queryKey: ["reward-balance"], queryFn: getMyRewardBalance });
  const catalog = useQuery({ queryKey: ["reward-catalog"], queryFn: listRewardCatalog });
  const redemptions = useQuery({ queryKey: ["reward-redemptions-mine"], queryFn: listMyRedemptions });

  const redeem = useMutation({
    mutationFn: (rewardItemId: string) => redeemReward(rewardItemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reward-balance"] });
      void queryClient.invalidateQueries({ queryKey: ["reward-redemptions-mine"] });
    },
  });
  const errorMessage = redeem.error instanceof ApiError ? redeem.error.message : undefined;

  return (
    <Card title="Rewards">
      <p className="mb-3 text-sm text-ink-muted">
        <span className="font-semibold text-positive">{balance.data?.pointsAvailable ?? 0}</span> points available (
        {balance.data?.pointsReceived ?? 0} earned, {balance.data?.pointsSpent ?? 0} redeemed)
      </p>
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}

      <ul className="mb-4 grid gap-2 sm:grid-cols-2">
        {catalog.data?.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-ink-faint">{item.pointsCost} pts</p>
            </div>
            <button
              type="button"
              disabled={redeem.isPending || (balance.data?.pointsAvailable ?? 0) < item.pointsCost}
              onClick={() => redeem.mutate(item.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
            >
              Redeem
            </button>
          </li>
        ))}
        {catalog.data?.length === 0 && <p className="text-ink-muted">No reward items in the catalog yet.</p>}
      </ul>

      <h3 className="mb-2 text-sm font-semibold">My Redemptions</h3>
      <ul className="space-y-2">
        {redemptions.data?.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <span>
              {r.rewardItem.name} <span className="text-xs text-ink-faint">({r.pointsSpent} pts)</span>
            </span>
            <Badge tone={redemptionTone(r.status)}>{r.status}</Badge>
          </li>
        ))}
        {redemptions.data?.length === 0 && <p className="text-ink-muted">No redemptions yet.</p>}
      </ul>
    </Card>
  );
}
