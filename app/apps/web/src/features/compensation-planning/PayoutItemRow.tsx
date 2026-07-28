import { Badge } from "../../components/ui/Badge";
import type { PayoutPlanItem } from "../../lib/api/types";
import { payoutItemStatusTone } from "./status-tone";

export function PayoutItemRow({
  item,
  onApprove,
  onReject,
  onPost,
}: {
  item: PayoutPlanItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPost: (id: string) => void;
}) {
  return (
    <tr>
      <td className="py-2">
        {item.employee.legalName} <span className="text-xs text-ink-faint">({item.employee.employeeCode})</span>
      </td>
      <td className="py-2">₹{item.proposedAmount.toLocaleString("en-IN")}</td>
      <td className="py-2">{item.reason}</td>
      <td className="py-2">
        <Badge tone={payoutItemStatusTone(item.status)}>{item.status}</Badge>
      </td>
      <td className="py-2 text-right">
        {item.status === "Proposed" && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onReject(item.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-negative hover:text-negative"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => onApprove(item.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Approve
            </button>
          </div>
        )}
        {item.status === "Approved" && (
          <button
            type="button"
            onClick={() => onPost(item.id)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            Post
          </button>
        )}
      </td>
    </tr>
  );
}
