import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import type { OvertimeRequest } from "../../lib/api/types";
import { workforceStatusTone } from "./status-tone";

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function OvertimeRequestList({ requests }: { requests: OvertimeRequest[] | undefined }) {
  return (
    <Card title="My Overtime Requests">
      <ul className="space-y-2">
        {requests?.map((req) => (
          <li key={req.id} className="rounded-lg border border-border p-3 text-sm">
            {new Date(req.date).toLocaleDateString("en-IN")} · {req.hoursRequested}h{" "}
            <Badge tone="neutral">{req.settlementType === "CompOff" ? "Comp Off" : "Payable"}</Badge>{" "}
            <Badge tone={workforceStatusTone(req.status)}>{req.status}</Badge>
            {req.payableAmount != null && <span className="ml-2 text-xs text-ink-faint">Est. payable: {money(req.payableAmount)}</span>}
            {req.compOffDaysCredited != null && (
              <span className="ml-2 text-xs text-ink-faint">Comp-off credited: {req.compOffDaysCredited} day(s)</span>
            )}
            {req.reason && <p className="mt-1 text-xs text-ink-faint">{req.reason}</p>}
          </li>
        ))}
        {requests?.length === 0 && <p className="text-sm text-ink-faint">No overtime requests yet.</p>}
      </ul>
    </Card>
  );
}
