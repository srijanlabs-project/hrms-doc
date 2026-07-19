import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { approveLeaveRequest, rejectLeaveRequest } from "../../lib/api/leave";
import { ApiError } from "../../lib/api/http";
import type { LeaveRequest } from "../../lib/api/types";
import { leaveStatusTone } from "./status-tone";

export function ApprovalDetailPanel({ request }: { request: LeaveRequest }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");

  const decide = useMutation({
    mutationFn: (decision: "approve" | "reject") =>
      decision === "approve" ? approveLeaveRequest(request.id, note) : rejectLeaveRequest(request.id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests-team"] });
      setNote("");
    },
  });

  const error = decide.error instanceof ApiError ? decide.error.message : null;
  const isPending = request.status === "Pending";

  return (
    <div className="w-80 shrink-0 space-y-4 rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{request.leaveType} Leave</h2>
        <Badge tone={leaveStatusTone(request.status)}>{request.status}</Badge>
      </div>

      <dl className="space-y-2 text-xs">
        <Row label="Employee" value={`${request.employee.legalName} (${request.employee.employeeCode})`} />
        <Row label="Dates" value={`${formatDate(request.startDate)} – ${formatDate(request.endDate)}`} />
        <Row label="Duration" value={`${request.days} day(s)`} />
        {request.reason && <Row label="Reason" value={request.reason} />}
        {request.decisionNote && <Row label="Decision Note" value={request.decisionNote} />}
      </dl>

      {isPending && (
        <>
          {error && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{error}</p>}
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Note (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => decide.mutate("reject")}
              disabled={decide.isPending}
              className="flex-1 rounded-lg border border-negative px-3 py-2 font-semibold text-negative hover:bg-negative-soft disabled:opacity-60"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => decide.mutate("approve")}
              disabled={decide.isPending}
              className="flex-1 rounded-lg bg-primary px-3 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              Approve
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border pb-2">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
