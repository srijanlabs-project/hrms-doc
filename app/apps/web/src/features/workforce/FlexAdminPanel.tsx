import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { assignFlexPolicy, createFlexPolicy, listFlexPolicies } from "../../lib/api/flex";
import { ApiError } from "../../lib/api/http";

/** Admin-only: flexible-hours policy catalog + effective-dated standing assignment, mirroring ShiftAdminPanel. */
export function FlexAdminPanel() {
  const queryClient = useQueryClient();
  const policies = useQuery({ queryKey: ["flex-policies"], queryFn: listFlexPolicies });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [name, setName] = useState("");
  const [coreStartTime, setCoreStartTime] = useState("11:00");
  const [coreEndTime, setCoreEndTime] = useState("16:00");
  const [requiredDailyMinutes, setRequiredDailyMinutes] = useState("480");

  const [assignEmployeeId, setAssignEmployeeId] = useState("");
  const [assignPolicyId, setAssignPolicyId] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createFlexPolicy({ name, coreStartTime, coreEndTime, requiredDailyMinutes: Number(requiredDailyMinutes) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flex-policies"] });
      setName("");
    },
  });

  const assignMutation = useMutation({
    mutationFn: () => assignFlexPolicy({ employeeId: assignEmployeeId, policyId: assignPolicyId, effectiveFrom }),
    onSuccess: () => {
      setAssignEmployeeId("");
      setEffectiveFrom("");
    },
  });

  return (
    <div className="space-y-4">
      <Card title="Flexible Hours Policies">
        {createMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
        )}
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input w-40" />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Core start</span>
            <input required type="time" value={coreStartTime} onChange={(e) => setCoreStartTime(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Core end</span>
            <input required type="time" value={coreEndTime} onChange={(e) => setCoreEndTime(e.target.value)} className="input" />
          </label>
          <input
            required
            type="number"
            min="1"
            placeholder="Required mins/day"
            value={requiredDailyMinutes}
            onChange={(e) => setRequiredDailyMinutes(e.target.value)}
            className="input w-32"
          />
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
            Add Policy
          </button>
        </form>
        <ul className="space-y-1">
          {policies.data?.map((p) => (
            <li key={p.id} className="rounded-lg border border-border p-2 text-sm">
              {p.name} · core hours {p.coreStartTime}–{p.coreEndTime} · {p.requiredDailyMinutes}min/day required
            </li>
          ))}
          {policies.data?.length === 0 && <p className="text-sm text-ink-faint">No flexible hours policies yet.</p>}
        </ul>
      </Card>

      <Card title="Assign Flexible Hours">
        {assignMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{assignMutation.error.message}</p>
        )}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            assignMutation.mutate();
          }}
        >
          <select required value={assignEmployeeId} onChange={(e) => setAssignEmployeeId(e.target.value)} className="input">
            <option value="">Employee…</option>
            {employees.data?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.legalName}
              </option>
            ))}
          </select>
          <select required value={assignPolicyId} onChange={(e) => setAssignPolicyId(e.target.value)} className="input">
            <option value="">Policy…</option>
            {policies.data?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input required type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className="input" />
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
            Assign
          </button>
        </form>
        {assignMutation.isSuccess && <p className="mt-2 text-xs text-positive">Assigned.</p>}
      </Card>
    </div>
  );
}
