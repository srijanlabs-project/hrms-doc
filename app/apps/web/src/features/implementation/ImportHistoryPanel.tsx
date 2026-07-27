import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listImportBatches, rollbackImportBatch } from "../../lib/api/implementation";

/** History of committed import runs — extracted from ImplementationHubPage to keep it under the line limit. */
export function ImportHistoryPanel() {
  const queryClient = useQueryClient();
  const batches = useQuery({ queryKey: ["import-batches"], queryFn: listImportBatches });

  const rollbackMutation = useMutation({
    mutationFn: rollbackImportBatch,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["import-batches"] }),
  });
  const rollbackError = rollbackMutation.error instanceof ApiError ? rollbackMutation.error.message : undefined;

  return (
    <Card title="Import History">
      {rollbackError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{rollbackError}</p>}
      <ul className="space-y-2">
        {batches.data?.map((batch) => (
          <li key={batch.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <span>
              <span className="font-mono text-xs">{batch.entityType}</span> · {batch.successCount}/{batch.totalRows} succeeded ·{" "}
              {new Date(batch.createdAt).toLocaleString("en-IN")}
              <Badge tone={batch.status === "Committed" ? "positive" : "neutral"}>{batch.status}</Badge>
            </span>
            {batch.status === "Committed" && (
              <button
                onClick={() => rollbackMutation.mutate(batch.id)}
                disabled={rollbackMutation.isPending}
                className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface-muted disabled:opacity-60"
              >
                Rollback
              </button>
            )}
          </li>
        ))}
        {batches.data?.length === 0 && <p className="text-sm text-ink-faint">No imports run yet.</p>}
      </ul>
    </Card>
  );
}
