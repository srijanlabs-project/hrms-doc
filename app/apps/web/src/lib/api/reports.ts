import { apiRequest } from "./http";
import type { ReportsSummary } from "./types";

export function getReportsSummary(): Promise<ReportsSummary> {
  return apiRequest<ReportsSummary>("/reports/summary");
}
