import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { ApiError } from "../../lib/api/http";
import {
  ASSIGNABLE_ROLES,
  ROLE_LABELS,
  provisionLogin,
  updateUserRoles,
  type AssignableRole,
  type EmployeeAccessRow,
} from "../../lib/api/user-access";

export function UserAccessRow({ row }: { row: EmployeeAccessRow }) {
  const queryClient = useQueryClient();
  const [role, setRole] = useState<AssignableRole>((row.user?.roles[0] as AssignableRole) ?? "employee");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["user-access"] });
  const create = useMutation({ mutationFn: () => provisionLogin(row.employeeId, [role]), onSuccess: invalidate });
  const changeRole = useMutation({
    mutationFn: (next: AssignableRole) => updateUserRoles(row.user!.id, [next]),
    onSuccess: invalidate,
  });
  const error = [create.error, changeRole.error].find((e) => e instanceof ApiError) as ApiError | undefined;

  const canCreate = !row.user && !!row.personalEmail && row.status !== "Separated";

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="min-w-0">
          <span className="font-medium">{row.legalName}</span>{" "}
          <span className="text-xs text-ink-faint">{row.employeeCode}</span>
          <span className="block truncate text-xs text-ink-faint">
            {row.personalEmail ?? "No email on record"}
            {row.departmentName ? ` · ${row.departmentName}` : ""}
          </span>
        </span>

        <div className="flex shrink-0 items-center gap-2">
          {row.user ? (
            <>
              <Badge tone="positive">Has login</Badge>
              <select
                value={role}
                onChange={(e) => {
                  const next = e.target.value as AssignableRole;
                  setRole(next);
                  changeRole.mutate(next);
                }}
                className="input w-40 text-xs"
                aria-label={`Role for ${row.legalName}`}
              >
                {ASSIGNABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <Badge tone={canCreate ? "warning" : "neutral"}>No login</Badge>
              {canCreate && (
                <>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AssignableRole)}
                    className="input w-40 text-xs"
                    aria-label={`Role for ${row.legalName}`}
                  >
                    {ASSIGNABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => create.mutate()}
                    disabled={create.isPending}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                  >
                    {create.isPending ? "Creating…" : "Create Login"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {error && <p className="mt-2 rounded-lg bg-negative-soft px-3 py-1.5 text-xs text-negative">{error.message}</p>}
    </li>
  );
}
