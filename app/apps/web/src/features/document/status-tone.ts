import type { BadgeTone } from "../../components/ui/Badge";

export function documentStatusTone(status: string): BadgeTone {
  if (status === "Published") return "positive";
  if (status === "Draft") return "warning";
  if (status === "Expired") return "negative";
  return "neutral";
}
