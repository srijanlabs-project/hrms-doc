import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { createObligation, generateNow, listObligations } from "../../lib/api/compliance";
import { ApiError } from "../../lib/api/http";

const CATEGORIES = ["PF", "ESIC", "TDS", "PT", "Custom"] as const;

/** Admin-only: monthly statutory obligation catalog. 05-compliance-calendar.md v1 slice. */
export function ComplianceObligationsPanel() {
  const queryClient = useQueryClient();
  const obligations = useQuery({ queryKey: ["compliance-obligations"], queryFn: listObligations });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("PF");
  const [dueDayOfMonth, setDueDayOfMonth] = useState("15");
  const [generateResult, setGenerateResult] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => createObligation({ code, name, category, dueDayOfMonth: Number(dueDayOfMonth) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance-obligations"] });
      setCode("");
      setName("");
    },
  });

  const generateMutation = useMutation({
    mutationFn: generateNow,
    onSuccess: () => {
      setGenerateResult("Generation run complete — check the task list below.");
      queryClient.invalidateQueries({ queryKey: ["compliance-tasks"] });
    },
  });

  return (
    <Card
      title="Compliance Obligations"
      action={
        <button
          type="button"
          onClick={() => {
            setGenerateResult(null);
            generateMutation.mutate();
          }}
          disabled={generateMutation.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover disabled:opacity-60"
        >
          {generateMutation.isPending ? "Running…" : "Generate This Month's Tasks"}
        </button>
      }
    >
      {generateResult && <p className="mb-2 text-xs text-ink-faint">{generateResult}</p>}
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <input required placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} className="input w-24" />
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input w-52" />
        <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="input">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Due day of month</span>
          <input
            required
            type="number"
            min="1"
            max="28"
            value={dueDayOfMonth}
            onChange={(e) => setDueDayOfMonth(e.target.value)}
            className="input w-24"
          />
        </label>
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Add Obligation
        </button>
      </form>

      <ul className="space-y-1">
        {obligations.data?.map((o) => (
          <li key={o.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
            <span>
              <span className="font-mono text-xs text-ink-faint">{o.code}</span> {o.name} · {o.category} · due day {o.dueDayOfMonth} of
              the following month
            </span>
            <Badge tone={o.isActive ? "positive" : "neutral"}>{o.isActive ? "Active" : "Inactive"}</Badge>
          </li>
        ))}
        {obligations.data?.length === 0 && <p className="text-sm text-ink-faint">No obligations configured yet.</p>}
      </ul>
    </Card>
  );
}
