import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { closeAccessReviewCycle, confirmAccessReviewItem, getAccessReviewCycle, revokeAccessReviewItem } from "../../lib/api/security";
import { AccessReviewItemRow } from "./AccessReviewItemRow";

/** Cycle drill-down — extracted from AccessReviewPage to keep it under the line limit. */
export function AccessReviewCycleDetail({ cycleId }: { cycleId: string }) {
  const queryClient = useQueryClient();
  const cycle = useQuery({ queryKey: ["access-review-cycle", cycleId], queryFn: () => getAccessReviewCycle(cycleId) });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["access-review-cycle", cycleId] });
    void queryClient.invalidateQueries({ queryKey: ["access-review-cycles"] });
  };

  const confirmMutation = useMutation({ mutationFn: confirmAccessReviewItem, onSuccess: invalidate });
  const revokeMutation = useMutation({
    mutationFn: ({ itemId, notes }: { itemId: string; notes: string }) => revokeAccessReviewItem(itemId, notes),
    onSuccess: invalidate,
  });
  const closeMutation = useMutation({ mutationFn: () => closeAccessReviewCycle(cycleId), onSuccess: invalidate });
  const closeError = closeMutation.error instanceof ApiError ? closeMutation.error.message : undefined;

  const pendingCount = cycle.data?.items?.filter((i) => i.decision === "Pending").length ?? 0;

  return (
    <Card
      title={`Cycle: ${cycle.data?.periodLabel ?? ""}`}
      action={
        cycle.data?.status === "Open" ? (
          <button
            onClick={() => closeMutation.mutate()}
            disabled={closeMutation.isPending}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Close Cycle
          </button>
        ) : undefined
      }
    >
      {closeError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{closeError}</p>}
      <p className="mb-3 text-xs text-ink-faint">
        {pendingCount} of {cycle.data?.items?.length ?? 0} item(s) still pending a decision.
      </p>
      <ul className="space-y-2">
        {cycle.data?.items?.map((item) => (
          <AccessReviewItemRow
            key={item.id}
            item={item}
            onConfirm={() => confirmMutation.mutate(item.id)}
            onRevoke={(notes) => revokeMutation.mutate({ itemId: item.id, notes })}
          />
        ))}
      </ul>
    </Card>
  );
}
