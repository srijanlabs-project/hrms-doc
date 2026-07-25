import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  approveEncashmentRequest,
  createEncashmentRequest,
  type LeaveEncashmentRequest,
  listAllEncashmentRequests,
  listMyEncashmentRequests,
  rejectEncashmentRequest,
} from "../../lib/api/leave-encashment";
import type { LeaveBalance } from "../../lib/api/types";

function statusTone(status: string) {
  if (status === "Approved") return "positive" as const;
  if (status === "Rejected") return "negative" as const;
  return "warning" as const;
}

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

function RequestRow({ request, isAdmin, onDecide }: { request: LeaveEncashmentRequest; isAdmin: boolean; onDecide: (action: "approve" | "reject", id: string) => void }) {
  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          {isAdmin && <span className="font-medium">{request.employee.legalName} — </span>}
          {request.days} day(s) of {request.leaveType} · {money(request.amount)} ({money(request.ratePerDay)}/day){" "}
          <Badge tone={statusTone(request.status)}>{request.status}</Badge>
          {request.reason && <p className="mt-1 text-xs text-ink-faint">{request.reason}</p>}
          {request.decisionNote && <p className="mt-1 text-xs text-ink-faint">Note: {request.decisionNote}</p>}
        </div>
        {isAdmin && request.status === "Pending" && (
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

/** Leave Management (E08) gap closure — encash leave while still in service; payout rides the next payroll run's arrears. */
export function LeaveEncashmentPanel({ balances, isAdmin }: { balances: LeaveBalance[] | undefined; isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const mine = useQuery({ queryKey: ["leave-encashment", "mine"], queryFn: listMyEncashmentRequests });
  const all = useQuery({ queryKey: ["leave-encashment", "all"], queryFn: () => listAllEncashmentRequests(), enabled: isAdmin });

  const [leaveType, setLeaveType] = useState("");
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["leave-encashment"] });

  const createMutation = useMutation({
    mutationFn: () => createEncashmentRequest({ leaveType, days: Number(days), reason: reason || undefined }),
    onSuccess: () => {
      invalidate();
      setLeaveType("");
      setDays("");
      setReason("");
    },
  });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveEncashmentRequest(id), onSuccess: invalidate });
  const rejectMutation = useMutation({ mutationFn: ({ id, note }: { id: string; note: string }) => rejectEncashmentRequest(id, note), onSuccess: invalidate });

  const decide = (action: "approve" | "reject", id: string) => {
    if (action === "approve") approveMutation.mutate(id);
    else {
      const note = window.prompt("Reason for rejecting this request?");
      if (note) rejectMutation.mutate({ id, note });
    }
  };

  const requests = isAdmin ? all.data : mine.data;

  return (
    <Card title="Leave Encashment">
      <div className="space-y-4">
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <select required value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="input">
            <option value="">Leave type…</option>
            {balances?.map((b) => (
              <option key={b.leaveType} value={b.leaveType}>
                {b.name} ({b.available} available)
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            min="0.5"
            step="0.5"
            placeholder="Days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="input w-24"
          />
          <input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="input flex-1 basis-40" />
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
            Request Encashment
          </button>
        </form>

        <ul className="space-y-2">
          {requests?.map((r) => (
            <RequestRow key={r.id} request={r} isAdmin={isAdmin} onDecide={decide} />
          ))}
          {requests?.length === 0 && <p className="text-sm text-ink-faint">No encashment requests yet.</p>}
        </ul>
      </div>
    </Card>
  );
}
