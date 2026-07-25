import { Badge } from "../../components/ui/Badge";
import type { TravelRequest } from "../../lib/api/types";
import { travelStatusTone } from "./status-tone";

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function TravelRequestRow({
  request,
  showEmployee = false,
  onCancel,
  onApprove,
  onReject,
  onMarkCompleted,
}: {
  request: TravelRequest;
  showEmployee?: boolean;
  onCancel?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onMarkCompleted?: (id: string) => void;
}) {
  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">
            {showEmployee ? `${request.employee.legalName} — ` : ""}
            {request.tripType}: {request.origin} → {request.destination}
          </span>{" "}
          <Badge tone={travelStatusTone(request.status)}>{request.status}</Badge>
          <p className="mt-1 text-xs text-ink-faint">
            {new Date(request.startDate).toLocaleDateString("en-IN")} –{" "}
            {new Date(request.endDate).toLocaleDateString("en-IN")}
            {request.estimatedCost != null && ` · ${money(request.estimatedCost)}`}
          </p>
          {request.purpose && <p className="mt-1 text-xs text-ink-faint">{request.purpose}</p>}
          {request.decisionNote && (
            <p className="mt-1 text-xs text-ink-faint">Note: {request.decisionNote}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          {request.status === "Pending" && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(request.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
            >
              Cancel
            </button>
          )}
          {request.status === "Pending" && onApprove && (
            <button
              type="button"
              onClick={() => onApprove(request.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Approve
            </button>
          )}
          {request.status === "Pending" && onReject && (
            <button
              type="button"
              onClick={() => onReject(request.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
            >
              Reject
            </button>
          )}
          {request.status === "Approved" && onMarkCompleted && (
            <button
              type="button"
              onClick={() => onMarkCompleted(request.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
