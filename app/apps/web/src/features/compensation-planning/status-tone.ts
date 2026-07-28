import type { BadgeTone } from "../../components/ui/Badge";

export function cycleStatusTone(status: string): BadgeTone {
  return status === "Closed" ? "neutral" : "positive";
}

export function reviewItemStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Applied":
      return "positive";
    case "Approved":
      return "info";
    case "Proposed":
    default:
      return "warning";
  }
}

export function payoutItemStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Posted":
      return "positive";
    case "Approved":
      return "info";
    case "Rejected":
      return "negative";
    case "Proposed":
    default:
      return "warning";
  }
}
