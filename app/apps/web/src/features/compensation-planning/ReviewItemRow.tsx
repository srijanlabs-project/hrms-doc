import { Badge } from "../../components/ui/Badge";
import type { CompensationReviewItem } from "../../lib/api/types";
import { reviewItemStatusTone } from "./status-tone";

export function ReviewItemRow({
  item,
  onApprove,
  onApply,
}: {
  item: CompensationReviewItem;
  onApprove: (id: string) => void;
  onApply: (id: string) => void;
}) {
  return (
    <tr>
      <td className="py-2">
        {item.employee.legalName} <span className="text-xs text-ink-faint">({item.employee.employeeCode})</span>
      </td>
      <td className="py-2">₹{item.currentMonthlyBasic.toLocaleString("en-IN")}</td>
      <td className="py-2">₹{item.proposedMonthlyBasic.toLocaleString("en-IN")}</td>
      <td className="py-2">
        <Badge tone={reviewItemStatusTone(item.status)}>{item.status}</Badge>
      </td>
      <td className="py-2 text-right">
        {item.status === "Proposed" && (
          <button
            type="button"
            onClick={() => onApprove(item.id)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            Approve
          </button>
        )}
        {item.status === "Approved" && (
          <button
            type="button"
            onClick={() => onApply(item.id)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            Apply
          </button>
        )}
      </td>
    </tr>
  );
}
