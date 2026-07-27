import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listAuditLogs } from "../../lib/api/security";
import { useAuth } from "../auth/AuthProvider";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** W0·E29 Security and Governance — read-side viewer for the Audit Engine (E00), which had a working write API and zero frontend consumer until now. */
export function AuditLogPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const logs = useQuery({ queryKey: ["audit-logs"], queryFn: listAuditLogs, enabled: isAdmin });
  const [entityTypeFilter, setEntityTypeFilter] = useState("");

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Audit logs are restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  const entityTypes = Array.from(new Set(logs.data?.map((l) => l.entityType) ?? [])).sort();
  const filtered = entityTypeFilter ? logs.data?.filter((l) => l.entityType === entityTypeFilter) : logs.data;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-ink-muted">Every significant state change with no dedicated history table of its own, most recent first.</p>
      </header>

      <Card
        title="Recent Activity"
        action={
          <select value={entityTypeFilter} onChange={(e) => setEntityTypeFilter(e.target.value)} className="input w-48">
            <option value="">All entity types</option>
            {entityTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        }
      >
        <ul className="space-y-2">
          {filtered?.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  <span className="font-semibold">{entry.actor.email}</span> {entry.action.toLowerCase()} a{" "}
                  <span className="font-mono text-xs">{entry.entityType}</span>
                </span>
                <span className="text-xs text-ink-faint">{new Date(entry.createdAt).toLocaleString("en-IN")}</span>
              </div>
              {Boolean(entry.before || entry.after) && (
                <pre className="mt-2 overflow-x-auto rounded-lg bg-canvas p-2 text-xs">
                  {JSON.stringify({ before: entry.before, after: entry.after }, null, 2)}
                </pre>
              )}
            </li>
          ))}
          {filtered?.length === 0 && <p className="text-sm text-ink-faint">No audit activity yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
