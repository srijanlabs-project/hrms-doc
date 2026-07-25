import type { BadgeTone } from "../../components/ui/Badge";

export function payrollRunStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Closed":
      return "neutral";
    case "Approved":
      return "positive";
    case "Processed":
      return "info";
    case "Draft":
    default:
      return "warning";
  }
}
