import type { BadgeTone } from "../../components/ui/Badge";

export function incidentStatusTone(status: string): BadgeTone {
  if (status === "Closed") return "positive";
  if (status === "Resolved") return "info";
  if (status === "UnderReview") return "warning";
  return "negative";
}

export function severityTone(severity: string): BadgeTone {
  if (severity === "Critical" || severity === "High") return "negative";
  if (severity === "Medium") return "warning";
  return "info";
}

export function assessmentStatusTone(status: string): BadgeTone {
  return status === "Completed" ? "positive" : "warning";
}

export function riskLevelTone(riskLevel: string): BadgeTone {
  if (riskLevel === "High") return "negative";
  if (riskLevel === "Medium") return "warning";
  return "positive";
}
