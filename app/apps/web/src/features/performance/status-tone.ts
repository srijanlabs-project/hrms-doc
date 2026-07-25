import type { BadgeTone } from "../../components/ui/Badge";

export function goalStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Completed":
      return "positive";
    case "Closed":
      return "neutral";
    case "Active":
    default:
      return "warning";
  }
}

export function appraisalStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Finalized":
      return "positive";
    case "ManagerReviewed":
      return "info";
    case "SelfSubmitted":
      return "warning";
    case "Draft":
    default:
      return "neutral";
  }
}
