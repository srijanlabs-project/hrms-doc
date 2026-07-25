import { Card } from "../../components/ui/Card";
import type { OvertimeRequest } from "../../lib/api/types";

export function OvertimeApprovals({
  requests,
  onApprove,
  onReject,
}: {
  requests: OvertimeRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <Card title="Team Overtime Approvals">
      <ul className="space-y-2">
        {requests.map((req) => (
          <li key={req.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <span>
              {req.employee.legalName} — {new Date(req.date).toLocaleDateString("en-IN")} · {req.hoursRequested}h
              {req.reason && ` · ${req.reason}`}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onApprove(req.id)}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onReject(req.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
