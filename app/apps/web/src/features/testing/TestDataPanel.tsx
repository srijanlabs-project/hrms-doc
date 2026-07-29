import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { generateTestData, listTestDataBatches, purgeTestDataBatch } from "../../lib/api/testing";

/**
 * Wave 5·E32 gap closure ("test data management") — a thin generator over
 * the existing Import Engine (E31): synthetic employees are created via the
 * same batch mechanism a real bulk import uses, so purge reuses the same
 * rollback (soft-delete) action, with no parallel data-creation path.
 */
export function TestDataPanel() {
  const queryClient = useQueryClient();
  const batches = useQuery({ queryKey: ["test-data-batches"], queryFn: listTestDataBatches });
  const [count, setCount] = useState("5");

  const generate = useMutation({
    mutationFn: () => generateTestData(Number(count)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["test-data-batches"] }),
  });
  const purge = useMutation({
    mutationFn: (id: string) => purgeTestDataBatch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["test-data-batches"] }),
  });
  const errorMessage = generate.error instanceof ApiError ? generate.error.message : undefined;

  return (
    <Card title="Test Data">
      <p className="mb-3 text-xs text-ink-faint">
        Generates synthetic employees via the Implementation &amp; Migration import engine — purging a batch reuses the
        same rollback (soft-delete) that a real bad import uses.
      </p>
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          generate.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Count</span>
          <input required type="number" min="1" max="50" value={count} onChange={(e) => setCount(e.target.value)} className="input w-24" />
        </label>
        <button
          type="submit"
          disabled={generate.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {generate.isPending ? "Generating…" : "Generate Synthetic Employees"}
        </button>
      </form>

      <ul className="space-y-2">
        {batches.data?.map((batch) => (
          <li key={batch.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <span>
              {batch.successCount}/{batch.totalRows} created · {new Date(batch.createdAt).toLocaleString("en-IN")}{" "}
              <Badge tone={batch.status === "Committed" ? "positive" : "neutral"}>{batch.status}</Badge>
            </span>
            {batch.status === "Committed" && (
              <button
                type="button"
                onClick={() => purge.mutate(batch.id)}
                disabled={purge.isPending}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover disabled:opacity-60"
              >
                Purge
              </button>
            )}
          </li>
        ))}
        {batches.data?.length === 0 && <p className="text-ink-muted">No test data batches yet.</p>}
      </ul>
    </Card>
  );
}
