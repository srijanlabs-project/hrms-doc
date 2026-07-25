import type { BadgeTone } from "../../components/ui/Badge";

export function courseStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Published":
      return "positive";
    case "Archived":
      return "neutral";
    case "Draft":
    default:
      return "warning";
  }
}

export function enrollmentStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Completed":
      return "positive";
    case "Overdue":
      return "negative";
    case "Withdrawn":
      return "neutral";
    case "Enrolled":
    default:
      return "warning";
  }
}

export function certificationStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Active":
      return "positive";
    case "Expiring":
      return "warning";
    case "Expired":
    case "Revoked":
      return "negative";
    default:
      return "neutral";
  }
}
