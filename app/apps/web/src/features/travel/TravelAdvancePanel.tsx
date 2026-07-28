import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listAdvancesForTravelRequest, requestTravelAdvance } from "../../lib/api/travel";
import { ApiError } from "../../lib/api/http";

function advanceTone(status: string): "positive" | "warning" | "negative" | "neutral" {
  if (status === "Disbursed") return "positive";
  if (status === "Requested") return "warning";
  if (status === "Rejected") return "negative";
  return "neutral";
}

/** Self-service: request a cash advance against this trip. No repayment schedule — reconciled once at settlement. */
export function TravelAdvancePanel({ travelRequestId }: { travelRequestId: string }) {
  const queryClient = useQueryClient();
  const advances = useQuery({
    queryKey: ["travel-advances", travelRequestId],
    queryFn: () => listAdvancesForTravelRequest(travelRequestId),
  });
  const [requestedAmount, setRequestedAmount] = useState("");

  const request = useMutation({
    mutationFn: () => requestTravelAdvance(travelRequestId, Number(requestedAmount)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["travel-advances", travelRequestId] });
      setRequestedAmount("");
    },
  });
  const errorMessage = request.error instanceof ApiError ? request.error.message : undefined;

  return (
    <Card title="Travel Advance">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          request.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Amount (₹)</span>
          <input
            required
            type="number"
            min="1"
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            className="input w-36"
          />
        </label>
        <button
          type="submit"
          disabled={request.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {request.isPending ? "Requesting…" : "Request Advance"}
        </button>
      </form>

      <ul className="space-y-2">
        {advances.data?.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <span>
              ₹{a.requestedAmount.toLocaleString("en-IN")}
              {a.approvedAmount != null && a.approvedAmount !== a.requestedAmount && (
                <span className="text-xs text-ink-faint"> (approved ₹{a.approvedAmount.toLocaleString("en-IN")})</span>
              )}
            </span>
            <Badge tone={advanceTone(a.status)}>{a.status}</Badge>
          </li>
        ))}
        {advances.data?.length === 0 && <p className="text-ink-muted">No advance requests yet.</p>}
      </ul>
    </Card>
  );
}
