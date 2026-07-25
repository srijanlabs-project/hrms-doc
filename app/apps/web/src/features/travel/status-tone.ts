import type { BadgeTone } from "../../components/ui/Badge";

export function travelStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Approved":
      return "info";
    case "Completed":
      return "positive";
    case "Rejected":
    case "Cancelled":
      return "negative";
    case "Pending":
    default:
      return "warning";
  }
}
