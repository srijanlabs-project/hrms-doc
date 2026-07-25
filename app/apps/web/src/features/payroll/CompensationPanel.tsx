import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { listCompensation, setCompensation } from "../../lib/api/payroll";

/** Admin-only: set/update the flat monthlyBasic that drives PayrollCalculationService (see backend calc file for what's derived from it). */
export function CompensationPanel() {
  const queryClient = useQueryClient();
  const compensation = useQuery({ queryKey: ["payroll-compensation"], queryFn: listCompensation });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [employeeId, setEmployeeId] = useState("");
  const [monthlyBasic, setMonthlyBasic] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");

  const mutation = useMutation({
    mutationFn: () => setCompensation({ employeeId, monthlyBasic: Number(monthlyBasic), effectiveFrom }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["payroll-compensation"] });
      setEmployeeId("");
      setMonthlyBasic("");
      setEffectiveFrom("");
    },
  });

  const generalError = mutation.error instanceof ApiError ? mutation.error.message : undefined;

  return (
    <Card title="Compensation">
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        {generalError && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{generalError}</p>}

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Employee</span>
          <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
            <option value="">Select employee</option>
            {employees.data?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.legalName} ({e.employeeCode})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Monthly Basic (₹)</span>
          <input
            required
            type="number"
            min="1"
            step="1"
            value={monthlyBasic}
            onChange={(e) => setMonthlyBasic(e.target.value)}
            className="input w-36"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Effective From</span>
          <input
            required
            type="date"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            className="input"
          />
        </label>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {mutation.isPending ? "Saving…" : "Set"}
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-ink-faint">
          <tr>
            <th className="pb-2">Employee</th>
            <th className="pb-2">Monthly Basic</th>
            <th className="pb-2">Effective From</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {compensation.data?.map((c) => (
            <tr key={c.id}>
              <td className="py-2">
                {c.employee.legalName} <span className="text-xs text-ink-faint">({c.employee.employeeCode})</span>
              </td>
              <td className="py-2">₹{c.monthlyBasic.toLocaleString("en-IN")}</td>
              <td className="py-2">{new Date(c.effectiveFrom).toLocaleDateString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {compensation.data?.length === 0 && <p className="text-ink-muted">No compensation records yet.</p>}
    </Card>
  );
}
