import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { KpiCard } from "../../components/ui/KpiCard";
import { listTeamLeaveRequests } from "../../lib/api/leave";
import { ApprovalDetailPanel } from "./ApprovalDetailPanel";
import { leaveStatusTone } from "./status-tone";

/**
 * T-007 Approval Workspace -> leave approvals only (this is the first and
 * only workflow vertical so far). Board's TAT/donut/delegation/attachment
 * surfaces are deferred — no data backs them yet.
 */
export function ApprovalsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const requests = useQuery({ queryKey: ["leave-requests-team"], queryFn: () => listTeamLeaveRequests() });

  const { pending, approvedCount, rejectedCount } = useMemo(() => {
    const all = requests.data ?? [];
    return {
      pending: all.filter((r) => r.status === "Pending"),
      approvedCount: all.filter((r) => r.status === "Approved").length,
      rejectedCount: all.filter((r) => r.status === "Rejected").length,
    };
  }, [requests.data]);

  const selected = requests.data?.find((r) => r.id === selectedId) ?? pending[0] ?? null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Approvals</h1>
        <p className="text-ink-muted">Review and decide on your team's leave requests.</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Pending Approvals" value={String(pending.length)} caption="Awaiting your decision" />
        <KpiCard label="Approved" value={String(approvedCount)} caption="All time" />
        <KpiCard label="Rejected" value={String(rejectedCount)} caption="All time" />
      </div>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          {requests.isLoading && <p className="text-ink-muted">Loading approvals…</p>}
          {pending.length === 0 && !requests.isLoading && (
            <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
              No pending approvals.
            </div>
          )}
          {pending.map((request) => (
            <button
              key={request.id}
              type="button"
              onClick={() => setSelectedId(request.id)}
              className={`flex w-full items-center gap-3 rounded-(--radius-card) border p-4 text-left shadow-(--shadow-card) ${
                selected?.id === request.id ? "border-primary bg-primary-soft" : "border-border bg-surface"
              }`}
            >
              <Avatar name={request.employee.legalName} />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{request.employee.legalName}</div>
                <div className="text-xs text-ink-faint">
                  {request.leaveType} · {request.days} day(s) ·{" "}
                  {new Date(request.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
              </div>
              <Badge tone={leaveStatusTone(request.status)}>{request.status}</Badge>
            </button>
          ))}
        </div>

        {selected && <ApprovalDetailPanel request={selected} />}
      </div>
    </div>
  );
}
