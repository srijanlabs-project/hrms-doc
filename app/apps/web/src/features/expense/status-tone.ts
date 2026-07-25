import type { BadgeTone } from "../../components/ui/Badge";

export function expenseStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Approved":
      return "info";
    case "Paid":
      return "positive";
    case "Rejected":
    case "Cancelled":
      return "negative";
    case "Pending":
    default:
      return "warning";
  }
}
