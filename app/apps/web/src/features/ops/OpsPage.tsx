import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { getSystemHealth, listBackupRecords, runBackupNow } from "../../lib/api/ops";
import { useAuth } from "../auth/AuthProvider";
import { BackupRecordRow } from "./BackupRecordRow";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * W0·E30 DevOps and Operations — bounded to what's real in a single local
 * Postgres instance: a JSON snapshot of core system-of-record tables
 * (org/people/leave/payroll) through the File Storage engine, a restore
 * *preview* (re-validates a snapshot's integrity, not a destructive
 * restore-execute), and a genuine DB-connectivity health check. Release
 * management and feature toggles stay deferred — no deploy pipeline or
 * environments to differentiate here.
 */
export function OpsPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const health = useQuery({ queryKey: ["system-health"], queryFn: getSystemHealth, enabled: isAdmin, refetchInterval: 30_000 });
  const records = useQuery({ queryKey: ["backup-records"], queryFn: listBackupRecords, enabled: isAdmin });

  const runMutation = useMutation({
    mutationFn: runBackupNow,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["backup-records"] }),
  });
  const runError = runMutation.error instanceof ApiError ? runMutation.error.message : undefined;

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Operations is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Operations</h1>
        <p className="text-ink-muted">System health, backups, and restore-readiness checks.</p>
      </header>

      <Card title="System Health">
        {health.data && (
          <div className="flex items-center gap-3 text-sm">
            <Badge tone={health.data.status === "up" ? "positive" : "negative"}>API {health.data.status}</Badge>
            <Badge tone={health.data.database === "up" ? "positive" : "negative"}>Database {health.data.database}</Badge>
            <span className="text-xs text-ink-faint">Checked {new Date(health.data.time).toLocaleTimeString("en-IN")}</span>
          </div>
        )}
      </Card>

      <Card
        title="Backups"
        action={
          <button
            onClick={() => runMutation.mutate()}
            disabled={runMutation.isPending}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Run Backup Now
          </button>
        }
      >
        {runError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{runError}</p>}
        <p className="mb-3 text-xs text-ink-faint">
          A JSON snapshot of core system-of-record tables (org structure, people, leave, payroll), also run nightly.
        </p>
        <ul className="space-y-2">
          {records.data?.map((record) => (
            <BackupRecordRow key={record.id} record={record} />
          ))}
          {records.data?.length === 0 && <p className="text-sm text-ink-faint">No backups run yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
