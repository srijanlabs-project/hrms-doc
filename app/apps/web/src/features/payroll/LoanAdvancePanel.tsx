import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  approveLoanAdvanceRequest,
  createLoanAdvanceRequest,
  type LoanAdvanceRequest,
  type LoanAdvanceType,
  listAllLoanAdvanceRequests,
  listMyLoanAdvanceRequests,
  rejectLoanAdvanceRequest,
} from "../../lib/api/loan-advance";

function statusTone(status: string) {
  if (status === "Active") return "info" as const;
  if (status === "Closed") return "positive" as const;
  if (status === "Rejected") return "negative" as const;
  return "warning" as const;
}

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function RequestRow({
  request,
  isAdmin,
  onDecide,
}: {
  request: LoanAdvanceRequest;
  isAdmin: boolean;
  onDecide: (action: "approve" | "reject", id: string) => void;
}) {
  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          {isAdmin && <span className="font-medium">{request.employee.legalName} — </span>}
          {request.type}: {money(request.principal)} at {money(request.monthlyInstallment)}/month{" "}
          <Badge tone={statusTone(request.status)}>{request.status}</Badge>
          {(request.status === "Active" || request.status === "Closed") && (
            <span className="ml-2 text-xs text-ink-faint">Outstanding: {money(request.outstandingBalance)}</span>
          )}
          {request.reason && <p className="mt-1 text-xs text-ink-faint">{request.reason}</p>}
          {request.decisionNote && <p className="mt-1 text-xs text-ink-faint">Note: {request.decisionNote}</p>}
        </div>
        {isAdmin && request.status === "Requested" && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => onDecide("approve", request.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onDecide("reject", request.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

/** Payroll (E09) gap closure — flat-installment loans and advances, no interest. Approval disburses and payroll deducts the installment each run. */
export function LoanAdvancePanel({ isAdmin }: { isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const mine = useQuery({ queryKey: ["loan-advance", "mine"], queryFn: listMyLoanAdvanceRequests });
  const all = useQuery({ queryKey: ["loan-advance", "all"], queryFn: () => listAllLoanAdvanceRequests(), enabled: isAdmin });

  const [type, setType] = useState<LoanAdvanceType>("Loan");
  const [principal, setPrincipal] = useState("");
  const [monthlyInstallment, setMonthlyInstallment] = useState("");
  const [reason, setReason] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["loan-advance"] });

  const createMutation = useMutation({
    mutationFn: () =>
      createLoanAdvanceRequest({ type, principal: Number(principal), monthlyInstallment: Number(monthlyInstallment), reason: reason || undefined }),
    onSuccess: () => {
      invalidate();
      setPrincipal("");
      setMonthlyInstallment("");
      setReason("");
    },
  });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveLoanAdvanceRequest(id), onSuccess: invalidate });
  const rejectMutation = useMutation({ mutationFn: ({ id, note }: { id: string; note: string }) => rejectLoanAdvanceRequest(id, note), onSuccess: invalidate });

  const decide = (action: "approve" | "reject", id: string) => {
    if (action === "approve") approveMutation.mutate(id);
    else {
      const note = window.prompt("Reason for rejecting this request?");
      if (note) rejectMutation.mutate({ id, note });
    }
  };

  const requests = isAdmin ? all.data : mine.data;

  return (
    <Card title="Loans & Advances">
      <div className="space-y-4">
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <select value={type} onChange={(e) => setType(e.target.value as LoanAdvanceType)} className="input">
            <option value="Loan">Loan</option>
            <option value="Advance">Advance</option>
          </select>
          <input
            required
            type="number"
            min="1"
            placeholder="Principal (₹)"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="input w-36"
          />
          <input
            required
            type="number"
            min="1"
            placeholder="Monthly installment (₹)"
            value={monthlyInstallment}
            onChange={(e) => setMonthlyInstallment(e.target.value)}
            className="input w-44"
          />
          <input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="input flex-1 basis-40" />
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
            Request
          </button>
        </form>

        <ul className="space-y-2">
          {requests?.map((r) => (
            <RequestRow key={r.id} request={r} isAdmin={isAdmin} onDecide={decide} />
          ))}
          {requests?.length === 0 && <p className="text-sm text-ink-faint">No loan or advance requests yet.</p>}
        </ul>
      </div>
    </Card>
  );
}
