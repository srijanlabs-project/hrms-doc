import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { assignPayComponent, listPayComponents } from "../../lib/api/payroll";

/** Admin-only: assign a catalog component to an employee. 02-pay-components.md v1 slice. */
export function PayComponentAssignPanel() {
  const components = useQuery({ queryKey: ["pay-components"], queryFn: listPayComponents });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [employeeId, setEmployeeId] = useState("");
  const [payComponentId, setPayComponentId] = useState("");
  const [value, setValue] = useState("");

  const assignMutation = useMutation({
    mutationFn: () => assignPayComponent({ employeeId, payComponentId, value: value ? Number(value) : undefined }),
    onSuccess: () => {
      setEmployeeId("");
      setValue("");
    },
  });

  return (
    <Card title="Assign Component to Employee">
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
        <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
          <option value="">Employee…</option>
          {employees.data?.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.legalName}
            </option>
          ))}
        </select>
        <select required value={payComponentId} onChange={(e) => setPayComponentId(e.target.value)} className="input">
          <option value="">Component…</option>
          {components.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Override value (optional)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input w-44"
        />
        <button type="submit" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-surface-hover">
          Assign to Employee
        </button>
      </form>
    </Card>
  );
}
