import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  cancelRedemption,
  createRewardCatalogItem,
  fulfillRedemption,
  listAllRedemptionsAdmin,
  listRewardCatalogAdmin,
} from "../../lib/api/experience";
import { ApiError } from "../../lib/api/http";

function CatalogItemForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [pointsCost, setPointsCost] = useState("");
  const create = useMutation({
    mutationFn: () => createRewardCatalogItem({ name, pointsCost: Number(pointsCost) }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reward-catalog-admin"] });
      void queryClient.invalidateQueries({ queryKey: ["reward-catalog"] });
      setName("");
      setPointsCost("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <form
      className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate();
      }}
    >
      {errorMessage && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" className="input flex-1" />
      <input
        required
        type="number"
        min="1"
        value={pointsCost}
        onChange={(e) => setPointsCost(e.target.value)}
        placeholder="Points"
        className="input w-24"
      />
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        Add to Catalog
      </button>
    </form>
  );
}

/** Admin: reward catalog management and redemption fulfillment queue. */
export function RewardsAdminPanel() {
  const queryClient = useQueryClient();
  const catalog = useQuery({ queryKey: ["reward-catalog-admin"], queryFn: listRewardCatalogAdmin });
  const redemptions = useQuery({ queryKey: ["reward-redemptions-admin"], queryFn: listAllRedemptionsAdmin });
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["reward-redemptions-admin"] });
  const fulfill = useMutation({ mutationFn: (id: string) => fulfillRedemption(id), onSuccess: invalidate });
  const cancel = useMutation({ mutationFn: (id: string) => cancelRedemption(id), onSuccess: invalidate });

  return (
    <Card title="Rewards (Admin)">
      <h3 className="mb-2 text-sm font-semibold">Catalog ({catalog.data?.length ?? 0})</h3>
      <CatalogItemForm />

      <h3 className="mb-2 text-sm font-semibold">Redemption Requests</h3>
      <ul className="space-y-2">
        {redemptions.data?.map((r) => (
          <li key={r.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {r.employee.legalName} — {r.rewardItem.name}
              </span>
              <Badge tone={r.status === "Fulfilled" ? "positive" : r.status === "Cancelled" ? "neutral" : "warning"}>
                {r.status}
              </Badge>
            </div>
            {r.status === "Requested" && (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={fulfill.isPending}
                  onClick={() => fulfill.mutate(r.id)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Fulfill
                </button>
                <button
                  type="button"
                  disabled={cancel.isPending}
                  onClick={() => cancel.mutate(r.id)}
                  className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative"
                >
                  Cancel
                </button>
              </div>
            )}
          </li>
        ))}
        {redemptions.data?.length === 0 && <p className="text-ink-muted">No redemption requests yet.</p>}
      </ul>
    </Card>
  );
}
