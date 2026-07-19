import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { cancelLeaveRequest } from "../../lib/api/leave";
import type { LeaveRequest } from "../../lib/api/types";
import { leaveStatusTone } from "./status-tone";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function LeaveRequestsTable({ requests }: { requests: LeaveRequest[] }) {
  const queryClient = useQueryClient();
  const cancel = useMutation({
    mutationFn: cancelLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests-my"] });
      queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
    },
  });

  if (requests.length === 0) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        No leave requests yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-(--radius-card) border border-border bg-surface">
      <table className="w-full text-left">
        <thead className="border-b border-border text-xs uppercase text-ink-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Dates</th>
            <th className="px-4 py-3 font-medium">Days</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium">{request.leaveType}</td>
              <td className="px-4 py-3 text-ink-muted">
                {formatDate(request.startDate)} – {formatDate(request.endDate)}
              </td>
              <td className="px-4 py-3 text-ink-muted">{request.days}</td>
              <td className="px-4 py-3">
                <Badge tone={leaveStatusTone(request.status)}>{request.status}</Badge>
              </td>
              <td className="max-w-48 truncate px-4 py-3 text-ink-muted">{request.reason ?? "—"}</td>
              <td className="px-4 py-3 text-right">
                {request.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => cancel.mutate(request.id)}
                    disabled={cancel.isPending}
                    className="text-xs font-medium text-negative hover:underline disabled:opacity-60"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
