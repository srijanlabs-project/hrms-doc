import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createRetentionPolicy, listRetentionPolicies } from "../../lib/api/documents";

const CATEGORIES = ["All", "Policy", "Contract", "Certificate", "Form", "Report", "Other"] as const;

/** org_admin/hr_ops: define retention rules that the nightly sweep expires documents against. */
export function RetentionPolicyAdminPanel() {
  const queryClient = useQueryClient();
  const policies = useQuery({ queryKey: ["retention-policies"], queryFn: listRetentionPolicies });

  const [name, setName] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [retentionMonths, setRetentionMonths] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createRetentionPolicy({ name, category, retentionMonths: Number(retentionMonths) }),
    onSuccess: () => {
      setName("");
      setRetentionMonths("");
      queryClient.invalidateQueries({ queryKey: ["retention-policies"] });
    },
  });

  return (
    <Card title="Retention Policies">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <input required placeholder="Policy name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
        <select value={category} onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])} className="input">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          min={1}
          placeholder="Months"
          value={retentionMonths}
          onChange={(e) => setRetentionMonths(e.target.value)}
          className="input w-24"
        />
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Create
        </button>
      </form>

      <ul className="space-y-2">
        {policies.data?.map((p) => (
          <li key={p.id} className="rounded-lg border border-border p-3 text-sm">
            {p.name} — {p.category} — retain {p.retentionMonths} month{p.retentionMonths === 1 ? "" : "s"}
          </li>
        ))}
        {policies.data?.length === 0 && <p className="text-sm text-ink-faint">No retention policies defined yet.</p>}
      </ul>
    </Card>
  );
}
