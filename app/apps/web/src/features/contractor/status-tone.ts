import type { BadgeTone } from "../../components/ui/Badge";

export function workerStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Active":
      return "positive";
    case "PendingApproval":
      return "warning";
    case "Suspended":
    case "Expired":
      return "negative";
    case "Inactive":
      return "neutral";
    case "Draft":
    default:
      return "neutral";
  }
}
