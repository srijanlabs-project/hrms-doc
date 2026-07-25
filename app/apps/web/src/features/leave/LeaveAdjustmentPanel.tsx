import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { getLeaveLedger, listLeavePolicies, postLeaveAdjustment } from "../../lib/api/leave";

/** Admin-only: manual, audited balance corrections — 02-leave-accrual.md's manual-adjustment requirement. org_admin/hr_ops. */
export function LeaveAdjustmentPanel() {
  const queryClient = useQueryClient();
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });
  const policies = useQuery({ queryKey: ["leave-policies"], queryFn: listLeavePolicies });

  const [employeeId, setEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [amountDays, setAmountDays] = useState("");
  const [reason, setReason] = useState("");

  const ledger = useQuery({
    queryKey: ["leave-ledger", employeeId],
    queryFn: () => getLeaveLedger(employeeId),
    enabled: !!employeeId,
  });

  const adjustMutation = useMutation({
    mutationFn: () => postLeaveAdjustment({ employeeId, leaveType, amountDays: Number(amountDays), reason }),
    onSuccess: () => {
      setAmountDays("");
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["leave-ledger", employeeId] });
      queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  return (
    <Card title="Post Balance Adjustment">
      {adjustMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{adjustMutation.error.message}</p>
      )}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          adjustMutation.mutate();
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
        <select required value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="input">
          <option value="">Leave type…</option>
          {policies.data?.map((p) => (
            <option key={p.leaveType} value={p.leaveType}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          step="0.5"
          placeholder="+/- days"
          value={amountDays}
          onChange={(e) => setAmountDays(e.target.value)}
          className="input w-28"
        />
        <input
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
          className="input flex-1 basis-52"
        />
        <button
          type="submit"
          disabled={adjustMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          Post Adjustment
        </button>
      </form>

      {employeeId && (
        <ul className="mt-4 space-y-1 border-t border-border pt-4">
          {ledger.data?.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
              <span>
                {entry.periodYear} · {entry.leaveType} · {entry.entryType} ·{" "}
                <span className={entry.amountDays >= 0 ? "text-positive" : "text-negative"}>
                  {entry.amountDays >= 0 ? "+" : ""}
                  {entry.amountDays}d
                </span>
                {entry.reason && ` — ${entry.reason}`}
              </span>
              <span className="text-xs text-ink-faint">{new Date(entry.createdAt).toLocaleDateString("en-IN")}</span>
            </li>
          ))}
          {ledger.data?.length === 0 && <p className="text-sm text-ink-faint">No ledger entries for this employee.</p>}
        </ul>
      )}
    </Card>
  );
}
