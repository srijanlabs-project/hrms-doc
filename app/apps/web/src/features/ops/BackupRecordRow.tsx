import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { previewBackupRestore } from "../../lib/api/ops";
import type { BackupPreview, BackupRecord } from "../../lib/api/ops";

/** One backup run — extracted from OpsPage to keep it under the line limit. */
export function BackupRecordRow({ record }: { record: BackupRecord }) {
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const previewMutation = useMutation({
    mutationFn: () => previewBackupRestore(record.id),
    onSuccess: setPreview,
  });

  const tableSummary = Object.entries(record.tableCounts)
    .map(([table, count]) => `${table}: ${count}`)
    .join(", ");

  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>
          <Badge tone={record.status === "Succeeded" ? "positive" : "negative"}>{record.status}</Badge>{" "}
          <span className="text-xs text-ink-faint">{record.triggeredBy}</span> ·{" "}
          {new Date(record.createdAt).toLocaleString("en-IN")}
        </span>
        <span className="flex items-center gap-2">
          {record.file && (
            <a href={`/api/v1/files/${record.file.id}`} className="text-xs text-primary hover:underline">
              Download
            </a>
          )}
          <button
            onClick={() => previewMutation.mutate()}
            disabled={previewMutation.isPending}
            className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface-muted disabled:opacity-60"
          >
            Preview
          </button>
        </span>
      </div>
      {tableSummary && <p className="mt-1 text-xs text-ink-faint">{tableSummary}</p>}
      {record.errorMessage && <p className="mt-1 text-xs text-negative">{record.errorMessage}</p>}
      {preview && (
        <p className={`mt-2 rounded-lg px-2 py-1 text-xs ${preview.valid ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"}`}>
          {preview.valid
            ? `Verified: ${preview.matchesRecordedCounts ? "counts match the recorded snapshot" : "counts differ from the recorded snapshot"}.`
            : `Invalid: ${preview.reason}`}
        </p>
      )}
    </li>
  );
}
