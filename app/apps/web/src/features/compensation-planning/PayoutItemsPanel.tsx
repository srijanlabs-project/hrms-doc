import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import {
  approvePayoutItem,
  listPayoutItemsForCycle,
  postPayoutItem,
  proposePayoutItem,
  rejectPayoutItem,
} from "../../lib/api/compensation-planning";
import { ApiError } from "../../lib/api/http";
import { PayoutItemRow } from "./PayoutItemRow";

export function PayoutItemsPanel({ cycleId }: { cycleId: string }) {
  const queryClient = useQueryClient();
  const items = useQuery({ queryKey: ["payout-items", cycleId], queryFn: () => listPayoutItemsForCycle(cycleId) });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [employeeId, setEmployeeId] = useState("");
  const [proposedAmount, setProposedAmount] = useState("");
  const [reason, setReason] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["payout-items", cycleId] });

  const proposeMutation = useMutation({
    mutationFn: () => proposePayoutItem(cycleId, { employeeId, proposedAmount: Number(proposedAmount), reason }),
    onSuccess: () => {
      invalidate();
      setEmployeeId("");
      setProposedAmount("");
      setReason("");
    },
  });
  const approveMutation = useMutation({ mutationFn: (id: string) => approvePayoutItem(id), onSuccess: invalidate });
  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectPayoutItem(id, "Rejected by approver"),
    onSuccess: invalidate,
  });
  const postMutation = useMutation({
    mutationFn: (id: string) => postPayoutItem(id),
    onSuccess: () => {
      invalidate();
      void queryClient.invalidateQueries({ queryKey: ["payroll-compensation"] });
    },
  });

  const errorMessage = proposeMutation.error instanceof ApiError ? proposeMutation.error.message : undefined;

  return (
    <Card title="Payout Items">
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
          <span className="mb-1 block text-xs font-medium text-ink-muted">Amount (₹)</span>
          <input
            required
            type="number"
            min="1"
            value={proposedAmount}
            onChange={(e) => setProposedAmount(e.target.value)}
            className="input w-36"
          />
        </label>
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Reason</span>
          <input required value={reason} onChange={(e) => setReason(e.target.value)} className="input" />
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
            <th className="pb-2">Amount</th>
            <th className="pb-2">Reason</th>
            <th className="pb-2">Status</th>
            <th className="pb-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.data?.map((item) => (
            <PayoutItemRow
              key={item.id}
              item={item}
              onApprove={(id) => approveMutation.mutate(id)}
              onReject={(id) => rejectMutation.mutate(id)}
              onPost={(id) => postMutation.mutate(id)}
            />
          ))}
        </tbody>
      </table>
      {items.data?.length === 0 && <p className="text-ink-muted">No payout items yet — propose one above.</p>}
    </Card>
  );
}
