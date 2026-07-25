import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { completeTask, listTasks, waiveTask } from "../../lib/api/compliance";
import { fileDownloadUrl, uploadFile } from "../../lib/api/files";
import { ApiError } from "../../lib/api/http";

const STATUSES = ["All", "Open", "Overdue", "Completed", "Waived"] as const;

function statusTone(status: string): BadgeTone {
  if (status === "Completed") return "positive";
  if (status === "Overdue") return "negative";
  if (status === "Waived") return "neutral";
  return "warning";
}

/** Admin-only: monthly compliance task list — complete (with optional evidence upload) or waive. */
export function ComplianceTasksPanel() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("All");
  const tasks = useQuery({
    queryKey: ["compliance-tasks", filter],
    queryFn: () => listTasks(filter === "All" ? undefined : filter),
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["compliance-tasks"] });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      const evidenceFileId = file ? (await uploadFile(file)).id : undefined;
      return completeTask(id, note || undefined, evidenceFileId);
    },
    onSuccess: () => {
      setActiveTaskId(null);
      setNote("");
      setFile(null);
      invalidate();
    },
  });

  const waiveMutation = useMutation({
    mutationFn: (id: string) => waiveTask(id, note),
    onSuccess: () => {
      setActiveTaskId(null);
      setNote("");
      invalidate();
    },
  });

  return (
    <Card title="Compliance Tasks">
      <div className="mb-3 flex gap-1 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={
              filter === s
                ? "border-b-2 border-primary px-3 py-1.5 text-sm font-medium text-primary"
                : "px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink"
            }
          >
            {s}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {tasks.data?.map((task) => (
          <li key={task.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>
                {task.obligation.name} — {task.periodLabel} <Badge tone={statusTone(task.status)}>{task.status}</Badge>
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-faint">Due {new Date(task.dueDate).toLocaleDateString("en-IN")}</span>
                {(task.status === "Open" || task.status === "Overdue") && (
                  <button
                    type="button"
                    onClick={() => setActiveTaskId(activeTaskId === task.id ? null : task.id)}
                    className="rounded-lg border border-border px-3 py-1 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Act
                  </button>
                )}
              </div>
            </div>
            {task.note && <p className="mt-1 text-xs text-ink-faint">Note: {task.note}</p>}
            {task.evidenceFileId && (
              <a href={fileDownloadUrl(task.evidenceFileId)} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-primary hover:underline">
                View evidence
              </a>
            )}

            {activeTaskId === task.id && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {(completeMutation.error instanceof ApiError || waiveMutation.error instanceof ApiError) && (
                  <p className="rounded-lg bg-negative-soft px-3 py-2 text-xs text-negative">
                    {(completeMutation.error as ApiError)?.message ?? (waiveMutation.error as ApiError)?.message}
                  </p>
                )}
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" className="input w-full" />
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block text-xs text-ink-muted"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => completeMutation.mutate(task.id)}
                    disabled={completeMutation.isPending}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                  >
                    Mark Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => note && waiveMutation.mutate(task.id)}
                    disabled={waiveMutation.isPending || !note}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover disabled:opacity-60"
                  >
                    Waive (note required)
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
        {tasks.data?.length === 0 && <p className="text-sm text-ink-faint">No tasks for this filter.</p>}
      </ul>
    </Card>
  );
}
