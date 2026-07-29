import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listActivePerDiemPolicies, submitPerDiemClaim } from "../../lib/api/per-diem";

export function NewPerDiemClaimForm() {
  const queryClient = useQueryClient();
  const policies = useQuery({ queryKey: ["per-diem-policies-active"], queryFn: listActivePerDiemPolicies });

  const [policyId, setPolicyId] = useState("");
  const [numberOfDays, setNumberOfDays] = useState("1");

  const activePolicyId = policyId || policies.data?.[0]?.id || "";

  const submitMutation = useMutation({
    mutationFn: () => submitPerDiemClaim({ policyId: activePolicyId, numberOfDays: Number(numberOfDays) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["per-diem-claims-my"] });
      setNumberOfDays("1");
    },
  });
  const errorMessage = submitMutation.error instanceof ApiError ? submitMutation.error.message : undefined;

  return (
    <Card title="New Per Diem Claim">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      {policies.data?.length === 0 ? (
        <p className="text-ink-muted">No active per diem policies configured yet.</p>
      ) : (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submitMutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Policy</span>
            <select value={activePolicyId} onChange={(e) => setPolicyId(e.target.value)} className="input w-56">
              {policies.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.category} — ₹{p.dailyRate.toLocaleString("en-IN")}/day
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Number of Days</span>
            <input
              required
              type="number"
              min="1"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              className="input w-28"
            />
          </label>
          <button
            type="submit"
            disabled={submitMutation.isPending || !activePolicyId}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {submitMutation.isPending ? "Submitting…" : "Submit Claim"}
          </button>
        </form>
      )}
    </Card>
  );
}
