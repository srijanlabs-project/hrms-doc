import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { addSuccessor, deactivateCriticalRole, removeSuccessor } from "../../lib/api/talent";
import type { CriticalRoleWithRisk } from "../../lib/api/types";

const READINESS_LEVELS = ["ReadyNow", "Ready1Year", "Ready2Years", "Unknown"] as const;

export function CriticalRoleRow({ role }: { role: CriticalRoleWithRisk }) {
  const queryClient = useQueryClient();
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [employeeId, setEmployeeId] = useState("");
  const [readiness, setReadiness] = useState<(typeof READINESS_LEVELS)[number]>("Ready2Years");
  const [isEmergency, setIsEmergency] = useState(false);

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["critical-roles"] });
  const add = useMutation({
    mutationFn: () => addSuccessor(role.id, { employeeId, readiness, isEmergency }),
    onSuccess: () => {
      invalidate();
      setEmployeeId("");
      setIsEmergency(false);
    },
  });
  const remove = useMutation({ mutationFn: (id: string) => removeSuccessor(id), onSuccess: invalidate });
  const deactivate = useMutation({ mutationFn: () => deactivateCriticalRole(role.id), onSuccess: invalidate });
  const errorMessage = add.error instanceof ApiError ? add.error.message : undefined;

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">{role.title}</span>
          {role.department && <span className="text-ink-faint"> · {role.department.name}</span>}
          {role.incumbent && <span className="text-ink-faint"> · Incumbent: {role.incumbent.legalName}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={role.criticalityTier === "High" ? "negative" : role.criticalityTier === "Medium" ? "warning" : "neutral"}>
            {role.criticalityTier}
          </Badge>
          {role.hasReadyCoverage ? (
            <Badge tone="positive">Covered</Badge>
          ) : (
            <Badge tone="negative">At Risk</Badge>
          )}
          {role.departmentRisk && (
            <Badge tone={role.departmentRisk.attritionRate >= 20 ? "negative" : role.departmentRisk.attritionRate >= 10 ? "warning" : "neutral"}>
              Dept attrition {role.departmentRisk.attritionRate}%
            </Badge>
          )}
          <button
            type="button"
            disabled={deactivate.isPending}
            onClick={() => deactivate.mutate()}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
          >
            Deactivate
          </button>
        </div>
      </div>

      <ul className="mt-2 space-y-1 text-sm">
        {role.successors.map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-lg bg-primary-soft px-2 py-1">
            <span>
              {s.employee.legalName} — {s.readiness}
              {s.isEmergency && " (Emergency)"}
            </span>
            <button
              type="button"
              disabled={remove.isPending}
              onClick={() => remove.mutate(s.id)}
              className="text-xs text-negative hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
        {role.successors.length === 0 && <li className="text-ink-muted">No successors nominated yet.</li>}
      </ul>

      {errorMessage && <p className="mt-2 text-xs text-negative">{errorMessage}</p>}
      <form
        className="mt-2 flex flex-wrap items-end gap-2 border-t border-border pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input w-48 text-xs">
          <option value="">Nominate successor…</option>
          {employees.data?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.legalName}
            </option>
          ))}
        </select>
        <select value={readiness} onChange={(e) => setReadiness(e.target.value as typeof readiness)} className="input text-xs">
          {READINESS_LEVELS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} />
          Emergency
        </label>
        <button
          type="submit"
          disabled={add.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Add
        </button>
      </form>
    </li>
  );
}
