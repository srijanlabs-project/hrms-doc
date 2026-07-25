import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { applyItem, approveItem, listItemsForCycle, proposeItem } from "../../lib/api/compensation-planning";
import { ReviewItemRow } from "./ReviewItemRow";

export function ReviewItemsPanel({ cycleId }: { cycleId: string }) {
  const queryClient = useQueryClient();
  const items = useQuery({ queryKey: ["compensation-items", cycleId], queryFn: () => listItemsForCycle(cycleId) });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [employeeId, setEmployeeId] = useState("");
  const [proposedMonthlyBasic, setProposedMonthlyBasic] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["compensation-items", cycleId] });

  const proposeMutation = useMutation({
    mutationFn: () => proposeItem(cycleId, employeeId, Number(proposedMonthlyBasic)),
    onSuccess: () => {
      invalidate();
      setEmployeeId("");
      setProposedMonthlyBasic("");
    },
  });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveItem(id), onSuccess: invalidate });
  const applyMutation = useMutation({
    mutationFn: (id: string) => applyItem(id),
    onSuccess: () => {
      invalidate();
      void queryClient.invalidateQueries({ queryKey: ["payroll-compensation"] });
    },
  });

  const errorMessage = proposeMutation.error instanceof ApiError ? proposeMutation.error.message : undefined;

  return (
    <Card title="Review Items">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          proposeMutation.mutate();
        }}
      >
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Employee</span>
          <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
            <option value="">Select employee</option>
            {employees.data?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.legalName} ({emp.employeeCode})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Proposed Monthly Basic (₹)</span>
          <input
            required
            type="number"
            min="1"
            value={proposedMonthlyBasic}
            onChange={(e) => setProposedMonthlyBasic(e.target.value)}
            className="input w-40"
          />
        </label>
        <button
          type="submit"
          disabled={proposeMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {proposeMutation.isPending ? "Proposing…" : "Propose"}
        </button>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-ink-faint">
          <tr>
            <th className="pb-2">Employee</th>
            <th className="pb-2">Current</th>
            <th className="pb-2">Proposed</th>
            <th className="pb-2">Status</th>
            <th className="pb-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.data?.map((item) => (
            <ReviewItemRow
              key={item.id}
              item={item}
              onApprove={(id) => approveMutation.mutate(id)}
              onApply={(id) => applyMutation.mutate(id)}
            />
          ))}
        </tbody>
      </table>
      {items.data?.length === 0 && <p className="text-ink-muted">No review items yet — propose one above.</p>}
    </Card>
  );
}
