import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { approveFnfCase, createFnfCase, listFnfCases, releaseFnfCase } from "../../lib/api/payroll";

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function statusTone(status: string) {
  if (status === "Released") return "positive" as const;
  if (status === "Approved") return "info" as const;
  return "warning" as const;
}

/** Admin-only: full-and-final settlement cases for separated employees. 07-full-and-final-settlement.md v1 slice. */
export function FnfPanel() {
  const queryClient = useQueryClient();
  const cases = useQuery({ queryKey: ["fnf-cases"], queryFn: listFnfCases });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });
  const separatedEmployees = employees.data?.filter((e) => e.status === "Separated") ?? [];

  const [employeeId, setEmployeeId] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["fnf-cases"] });
  const createMutation = useMutation({
    mutationFn: () => createFnfCase(employeeId),
    onSuccess: () => {
      setEmployeeId("");
      invalidate();
    },
  });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveFnfCase(id), onSuccess: invalidate });
  const releaseMutation = useMutation({ mutationFn: (id: string) => releaseFnfCase(id), onSuccess: invalidate });

  return (
    <Card title="Full & Final Settlement">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
          <option value="">Separated employee…</option>
          {separatedEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.legalName}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Calculate Settlement
        </button>
        {separatedEmployees.length === 0 && <span className="text-xs text-ink-faint">No separated employees to settle.</span>}
      </form>

      <ul className="space-y-2">
        {cases.data?.map((c) => (
          <li key={c.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>
                {c.employee.legalName} — exit {new Date(c.exitDate).toLocaleDateString("en-IN")}{" "}
                <Badge tone={statusTone(c.status)}>{c.status}</Badge>
              </span>
              <div className="flex gap-2">
                {c.status === "Draft" && (
                  <button
                    type="button"
                    onClick={() => approveMutation.mutate(c.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Approve
                  </button>
                )}
                {c.status === "Approved" && (
                  <button
                    type="button"
                    onClick={() => releaseMutation.mutate(c.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Release
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              Final month net {money(c.finalMonthNetPay)} + leave encashment {money(c.leaveEncashment)} + arrears{" "}
              {money(c.arrearsIncluded)}
              {c.gratuityAmount > 0 && <> + gratuity {money(c.gratuityAmount)}</>} ={" "}
              <span className="font-semibold text-ink">{money(c.netPayable)}</span>
            </p>
          </li>
        ))}
        {cases.data?.length === 0 && <p className="text-sm text-ink-faint">No settlement cases yet.</p>}
      </ul>
    </Card>
  );
}
