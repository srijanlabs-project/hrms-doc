import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import {
  createIncentiveBonus,
  type IncentiveBonusPayType,
  listAllIncentiveBonuses,
  listMyIncentiveBonuses,
} from "../../lib/api/incentive-bonus";

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * Payroll (E09) gap closure — incentives, bonus, and variable pay collapse
 * into one type-tagged table. Admin-granted (no approval step — see
 * IncentiveBonusService); the payout rides the next payroll run's arrears.
 */
export function IncentiveBonusPanel({ isAdmin }: { isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const mine = useQuery({ queryKey: ["incentive-bonus", "mine"], queryFn: listMyIncentiveBonuses, enabled: !isAdmin });
  const all = useQuery({ queryKey: ["incentive-bonus", "all"], queryFn: listAllIncentiveBonuses, enabled: isAdmin });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees, enabled: isAdmin });

  const [employeeId, setEmployeeId] = useState("");
  const [payType, setPayType] = useState<IncentiveBonusPayType>("Bonus");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createIncentiveBonus({ employeeId, payType, amount: Number(amount), reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incentive-bonus"] });
      setEmployeeId("");
      setAmount("");
      setReason("");
    },
  });

  const records = isAdmin ? all.data : mine.data;

  return (
    <Card title="Incentives, Bonus & Variable Pay">
      <div className="space-y-4">
        {isAdmin && (
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
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
            <select value={payType} onChange={(e) => setPayType(e.target.value as IncentiveBonusPayType)} className="input">
              <option value="Bonus">Bonus</option>
              <option value="Incentive">Incentive</option>
              <option value="VariablePay">Variable Pay</option>
            </select>
            <input
              required
              type="number"
              min="1"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-32"
            />
            <input required placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="input flex-1 basis-40" />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
              Grant
            </button>
          </form>
        )}

        <ul className="space-y-2">
          {records?.map((r) => (
            <li key={r.id} className="rounded-lg border border-border p-3 text-sm">
              {isAdmin && <span className="font-medium">{r.employee.legalName} — </span>}
              <Badge tone="info">{r.payType === "VariablePay" ? "Variable Pay" : r.payType}</Badge> {money(r.amount)}
              <p className="mt-1 text-xs text-ink-faint">
                {r.reason} · {new Date(r.createdAt).toLocaleDateString("en-IN")}
              </p>
            </li>
          ))}
          {records?.length === 0 && <p className="text-sm text-ink-faint">No incentives, bonus, or variable pay granted yet.</p>}
        </ul>
      </div>
    </Card>
  );
}
