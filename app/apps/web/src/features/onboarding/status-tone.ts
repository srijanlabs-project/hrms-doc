import type { BadgeTone } from "../../components/ui/Badge";

export function onboardingCaseStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Activated":
      return "positive";
    case "Blocked":
      return "negative";
    case "Cancelled":
      return "neutral";
    case "InProgress":
    default:
      return "warning";
  }
}

export function onboardingTaskStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Completed":
      return "positive";
    case "Waived":
      return "neutral";
    case "NotStarted":
    default:
      return "warning";
  }
}
