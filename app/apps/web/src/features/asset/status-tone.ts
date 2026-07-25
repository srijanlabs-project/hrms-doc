import type { BadgeTone } from "../../components/ui/Badge";

export function assetStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Available":
      return "positive";
    case "Assigned":
      return "info";
    case "UnderRepair":
      return "warning";
    case "Retired":
      return "negative";
    default:
      return "warning";
  }
}

export function assignmentStatusTone(status: string): BadgeTone {
  return status === "Returned" ? "negative" : "info";
}
