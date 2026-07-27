import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listNumberSeries, updateNumberSeries } from "../../lib/api/admin";
import type { NumberSeries } from "../../lib/api/types";

function SeriesRow({ series, onSave }: { series: NumberSeries; onSave: (prefix: string, padding: number) => void }) {
  const [prefix, setPrefix] = useState(series.prefix);
  const [padding, setPadding] = useState(String(series.padding));

  return (
    <li className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3 text-sm">
      <span className="w-28 font-medium">{series.entityType}</span>
      <input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="input w-24" />
      <input type="number" min={1} max={10} value={padding} onChange={(e) => setPadding(e.target.value)} className="input w-16" />
      <span className="text-xs text-ink-faint">next: {series.prefix}{String(series.nextValue).padStart(series.padding, "0")}</span>
      <button
        onClick={() => onSave(prefix, Number(padding))}
        className="ml-auto rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface-muted"
      >
        Save
      </button>
    </li>
  );
}

/** W0·E28 Administration — admin edit of existing Number Series (E00 engine) prefix/padding, no new entityType creation (still a fixed set: Employee, Asset). */
export function NumberSeriesPanel() {
  const queryClient = useQueryClient();
  const series = useQuery({ queryKey: ["number-series"], queryFn: listNumberSeries });

  const updateMutation = useMutation({
    mutationFn: ({ id, prefix, padding }: { id: string; prefix: string; padding: number }) => updateNumberSeries(id, { prefix, padding }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["number-series"] }),
  });

  return (
    <Card title="Number Series">
      <p className="mb-3 text-sm text-ink-muted">Configure the prefix and zero-padding used for auto-generated codes.</p>
      <ul className="space-y-2">
        {series.data?.map((s) => (
          <SeriesRow key={s.id} series={s} onSave={(prefix, padding) => updateMutation.mutate({ id: s.id, prefix, padding })} />
        ))}
        {series.data?.length === 0 && <p className="text-sm text-ink-faint">No series allocated yet.</p>}
      </ul>
    </Card>
  );
}
