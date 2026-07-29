import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { getMyDepartmentBudget, setDepartmentBudget } from "../../lib/api/department-budget";

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * W5·P gap closure ("budget approvals"). No new approval workflow — this is
 * budget context alongside the manager's existing Leave/Expense/Travel
 * approvals above, computed live from real claim rows every fetch.
 */
export function DepartmentBudgetPanel({ isAdmin }: { isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const budget = useQuery({ queryKey: ["department-budget", "mine"], queryFn: () => getMyDepartmentBudget() });
  const [allocatedAmount, setAllocatedAmount] = useState("");

  const setMutation = useMutation({
    mutationFn: (departmentId: string) =>
      setDepartmentBudget(departmentId, budget.data?.periodYear ?? new Date().getFullYear(), Number(allocatedAmount)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department-budget"] });
      setAllocatedAmount("");
    },
  });

  if (budget.data === null) {
    return (
      <Card title="Department Budget">
        <p className="text-sm text-ink-faint">Your account isn't linked to a department, so there's no budget to show.</p>
      </Card>
    );
  }

  const data = budget.data;
  const utilization = data?.utilizationPercent;
  const overBudget = utilization !== null && utilization !== undefined && utilization > 100;

  return (
    <Card title="Department Budget">
      {data && (
        <>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>
              {money(data.spentTotal)} spent of {money(data.allocatedAmount)} allocated ({data.periodYear})
            </span>
            <span className={overBudget ? "font-semibold text-negative" : "text-ink-muted"}>
              {utilization === null ? "No allocation set" : `${utilization}%`}
            </span>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-surface-hover">
            <div
              className={`h-full ${overBudget ? "bg-negative" : "bg-primary"}`}
              style={{ width: `${Math.min(utilization ?? 0, 100)}%` }}
            />
          </div>
          <p className="mb-3 text-xs text-ink-faint">
            Expenses {money(data.breakdown.expenseTotal)} · Per diem {money(data.breakdown.perDiemTotal)} · Travel advances{" "}
            {money(data.breakdown.travelAdvanceTotal)}
          </p>
          {isAdmin && (
            <form
              className="flex flex-wrap items-end gap-2 border-t border-border pt-3"
              onSubmit={(e) => {
                e.preventDefault();
                setMutation.mutate(data.departmentId);
              }}
            >
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Set Allocated Amount ({data.periodYear})</span>
                <input
                  required
                  type="number"
                  min="0"
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(e.target.value)}
                  className="input w-40"
                />
              </label>
              <button
                type="submit"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
              >
                {setMutation.isPending ? "Saving…" : "Update Budget"}
              </button>
            </form>
          )}
        </>
      )}
    </Card>
  );
}
