import type { BadgeTone } from "../../components/ui/Badge";

export function workforceStatusTone(status: string): BadgeTone {
  if (status === "Approved" || status === "Published") return "positive";
  if (status === "Rejected" || status === "Withdrawn") return "negative";
  if (status === "Pending" || status === "Submitted" || status === "Draft") return "warning";
  return "neutral";
}
