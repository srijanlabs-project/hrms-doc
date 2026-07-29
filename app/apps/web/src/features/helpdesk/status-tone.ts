import type { BadgeTone } from "../../components/ui/Badge";

export function ticketStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Resolved":
      return "positive";
    case "Closed":
      return "neutral";
    case "Assigned":
    case "InProgress":
      return "info";
    case "Open":
    default:
      return "warning";
  }
}

export function grievanceStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Resolved":
      return "positive";
    case "Closed":
      return "neutral";
    case "UnderInvestigation":
      return "info";
    case "Received":
    default:
      return "warning";
  }
}

export function priorityTone(priority: string): BadgeTone {
  switch (priority) {
    case "Urgent":
      return "negative";
    case "High":
      return "warning";
    case "Low":
      return "neutral";
    case "Medium":
    default:
      return "info";
  }
}
