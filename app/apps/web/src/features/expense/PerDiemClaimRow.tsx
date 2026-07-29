import { Badge } from "../../components/ui/Badge";
import type { PerDiemClaim } from "../../lib/api/types";
import { expenseStatusTone } from "./status-tone";

export function PerDiemClaimRow({
  claim,
  showEmployee = false,
  onApprove,
  onReject,
  onMarkPaid,
}: {
  claim: PerDiemClaim;
  showEmployee?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onMarkPaid?: (id: string) => void;
}) {
  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">
            {showEmployee ? `${claim.employee.legalName} — ` : ""}
            {claim.policy.category}
          </span>{" "}
          <Badge tone={expenseStatusTone(claim.status)}>{claim.status}</Badge>
          <p className="mt-1 text-xs text-ink-faint">
            ₹{claim.computedAmount.toLocaleString("en-IN")} · {claim.numberOfDays} day(s) · ₹
            {claim.policy.dailyRate.toLocaleString("en-IN")}/day
          </p>
          {claim.decisionNote && <p className="mt-1 text-xs text-ink-faint">Note: {claim.decisionNote}</p>}
        </div>
        <div className="flex shrink-0 gap-2">
          {claim.status === "Pending" && onApprove && (
            <button
              type="button"
              onClick={() => onApprove(claim.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Approve
            </button>
          )}
          {claim.status === "Pending" && onReject && (
            <button
              type="button"
              onClick={() => onReject(claim.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
            >
              Reject
            </button>
          )}
          {claim.status === "Approved" && onMarkPaid && (
            <button
              type="button"
              onClick={() => onMarkPaid(claim.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Mark Paid
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
