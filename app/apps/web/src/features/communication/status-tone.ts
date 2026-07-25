import type { BadgeTone } from "../../components/ui/Badge";

export function announcementStatusTone(status: string): BadgeTone {
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

export function categoryTone(category: string): BadgeTone {
  switch (category) {
    case "Urgent":
      return "negative";
    case "Policy":
      return "info";
    case "Holiday":
      return "primary";
    case "Event":
      return "positive";
    case "General":
    default:
      return "neutral";
  }
}
