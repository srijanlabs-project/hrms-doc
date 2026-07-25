import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createFinancialCenter, listFinancialCenters } from "../../lib/api/org-settings";

const CENTER_TYPES = ["CostCenter", "ProfitCenter", "Project"];

/** Consolidates cost center hierarchy, profit center hierarchy, and project hierarchy into one type-tagged catalog. */
export function FinancialCenterSection() {
  const queryClient = useQueryClient();
  const centers = useQuery({ queryKey: ["financial-centers"], queryFn: listFinancialCenters });

  const [centerType, setCenterType] = useState("CostCenter");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createFinancialCenter({ centerType, code, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financial-centers"] });
      setCode("");
      setName("");
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Financial Centers (Cost Center / Profit Center / Project)">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Type</span>
          <select value={centerType} onChange={(e) => setCenterType(e.target.value)} className="input w-36">
            {CENTER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Code</span>
          <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input w-32" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Adding…" : "Add Center"}
        </button>
      </form>
      <ul className="flex flex-wrap gap-2">
        {centers.data?.map((c) => (
          <li key={c.id} className="rounded-lg border border-border px-3 py-1.5 text-sm">
            <span className="font-medium">{c.name}</span> <span className="text-ink-faint">({c.centerType})</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
