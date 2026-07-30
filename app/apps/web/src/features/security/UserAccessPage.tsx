import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { ApiError } from "../../lib/api/http";
import {
  ASSIGNABLE_ROLES,
  ROLE_LABELS,
  SKIP_REASON_LABELS,
  listUserAccess,
  provisionMissingLogins,
  type AssignableRole,
  type ProvisionResult,
} from "../../lib/api/user-access";
import { useAuth } from "../auth/AuthProvider";
import { UserAccessRow } from "./UserAccessRow";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * W1·E03 gap closure — granting sign-in access to employees who have a record
 * but no login (everyone added via Bulk Import or created directly in the
 * directory; only offer→employee conversion minted one automatically). The
 * bulk action is the point: onboarding a 50-person company one login at a
 * time was the tedious, error-prone path this replaces.
 */
export function UserAccessPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();
  const rows = useQuery({ queryKey: ["user-access"], queryFn: listUserAccess });
  const [bulkRole, setBulkRole] = useState<AssignableRole>("employee");
  const [lastRun, setLastRun] = useState<{ created: number; skipped: number; results: ProvisionResult[] } | null>(null);

  const bulk = useMutation({
    mutationFn: () => provisionMissingLogins([bulkRole]),
    onSuccess: (result) => {
      setLastRun(result);
      queryClient.invalidateQueries({ queryKey: ["user-access"] });
    },
  });
  const bulkError = bulk.error instanceof ApiError ? bulk.error.message : undefined;

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        User Access is restricted to HR Operations and Company Org Admin roles.
      </div>
    );
  }

  const data = rows.data ?? [];
  const withLogin = data.filter((r) => r.user).length;
  const eligible = data.filter((r) => !r.user && !!r.personalEmail && r.status !== "Separated").length;
  const blocked = data.filter((r) => !r.user && (!r.personalEmail || r.status === "Separated")).length;
  const skips = lastRun?.results.filter((r) => !r.created) ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">User Access</h1>
        <p className="text-ink-muted">
          Grant sign-in access to employees and set their role. Sign-in is by workspace code, email, and a one-time
          code — there's no password to set, so creating a login just enables the employee to sign in with their
          recorded email.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Employees" value={String(data.length)} caption="Active records" />
        <KpiCard label="Have a login" value={String(withLogin)} caption="Can sign in today" />
        <KpiCard label="Ready to grant" value={String(eligible)} caption="Have an email on record" />
        <KpiCard label="Needs attention" value={String(blocked)} caption="Missing email, or exited" />
      </div>

      <Card title="Grant Logins in Bulk">
        <p className="mb-3 text-xs text-ink-faint">
          Creates a login for every employee who doesn't have one yet, using the email on their employee record. Safe
          to re-run — anyone who already has a login is left untouched.
        </p>
        {bulkError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{bulkError}</p>}
        <div className="flex flex-wrap items-end gap-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Assign role</span>
            <select
              value={bulkRole}
              onChange={(e) => setBulkRole(e.target.value as AssignableRole)}
              className="input w-48"
            >
              {ASSIGNABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => bulk.mutate()}
            disabled={bulk.isPending || eligible === 0}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {bulk.isPending ? "Creating…" : `Create ${eligible} Login${eligible === 1 ? "" : "s"}`}
          </button>
        </div>

        {lastRun && (
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-sm">
              Created <span className="font-semibold text-positive">{lastRun.created}</span> login(s)
              {lastRun.skipped > 0 && <> · skipped {lastRun.skipped}</>}
            </p>
            {skips.length > 0 && (
              <ul className="mt-2 space-y-1">
                {skips.map((s) => (
                  <li key={s.employeeId} className="text-xs text-ink-faint">
                    <span className="font-medium text-ink-muted">{s.legalName}</span> —{" "}
                    {s.skipReason ? SKIP_REASON_LABELS[s.skipReason] : "Skipped"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>

      <Card title="Employees">
        <ul className="space-y-2">
          {data.map((row) => (
            <UserAccessRow key={row.employeeId} row={row} />
          ))}
          {data.length === 0 && <p className="text-ink-muted">No employees yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
