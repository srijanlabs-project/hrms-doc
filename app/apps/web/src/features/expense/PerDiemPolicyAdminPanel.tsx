import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createPerDiemPolicy, listAllPerDiemPolicies } from "../../lib/api/per-diem";

const CATEGORIES = ["Domestic", "International", "Other"];

/** org_admin/hr_ops only — see PerDiemPanel's role gate. */
export function PerDiemPolicyAdminPanel() {
  const queryClient = useQueryClient();
  const policies = useQuery({ queryKey: ["per-diem-policies-all"], queryFn: listAllPerDiemPolicies });

  const [category, setCategory] = useState("Domestic");
  const [dailyRate, setDailyRate] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createPerDiemPolicy({ category, dailyRate: Number(dailyRate) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["per-diem-policies-all"] });
      queryClient.invalidateQueries({ queryKey: ["per-diem-policies-active"] });
      setDailyRate("");
    },
  });
  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Per Diem Policies (Admin)">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-40">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Daily Rate (₹)</span>
          <input required type="number" min="1" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} className="input w-32" />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
        >
          {createMutation.isPending ? "Saving…" : "Add Policy"}
        </button>
      </form>
      <ul className="space-y-1">
        {policies.data?.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
            <span>
              {p.category} — ₹{p.dailyRate.toLocaleString("en-IN")}/day
            </span>
            <Badge tone={p.active ? "positive" : "neutral"}>{p.active ? "Active" : "Inactive"}</Badge>
          </li>
        ))}
        {policies.data?.length === 0 && <p className="text-xs text-ink-faint">No per diem policies yet.</p>}
      </ul>
    </Card>
  );
}
