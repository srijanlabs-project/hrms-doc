import { apiRequest } from "./http";

export interface MonthPoint {
  month: string;
  headcount: number;
  separations: number;
  attritionRate: number;
}

export function getWorkforceTrend(months = 12): Promise<MonthPoint[]> {
  return apiRequest(`/analytics/workforce/trend?months=${months}`);
}

export interface DistributionSlice {
  label: string;
  count: number;
}

export interface ExecutiveSummary {
  activeHeadcount: number;
  latestAttritionRate: number;
  averageTenureYears: number;
  departmentDistribution: DistributionSlice[];
  genderDistribution: DistributionSlice[];
}

export function getExecutiveSummary(): Promise<ExecutiveSummary> {
  return apiRequest("/analytics/workforce/executive-summary");
}

export const REPORTABLE_ENTITY_TYPES = ["Employee", "LeaveRequest", "PayrollRunResult"] as const;
export type ReportableEntityType = (typeof REPORTABLE_ENTITY_TYPES)[number];

export interface EntityFieldSet {
  entityType: ReportableEntityType;
  fields: string[];
}

export interface ReportDefinition {
  id: string;
  name: string;
  entityType: ReportableEntityType;
  selectedFields: string[];
  filters: Record<string, string | number | boolean> | null;
  createdAt: string;
}

export function listReportFields(): Promise<EntityFieldSet[]> {
  return apiRequest("/analytics/reports/fields");
}

export function listReportDefinitions(): Promise<ReportDefinition[]> {
  return apiRequest("/analytics/reports");
}

export function createReportDefinition(input: {
  name: string;
  entityType: ReportableEntityType;
  selectedFields: string[];
  filters?: Record<string, string | number | boolean>;
}): Promise<ReportDefinition> {
  return apiRequest("/analytics/reports", { method: "POST", body: JSON.stringify(input) });
}

export function deleteReportDefinition(id: string): Promise<void> {
  return apiRequest(`/analytics/reports/${id}`, { method: "DELETE" });
}

export function runAdHocReport(input: {
  entityType: ReportableEntityType;
  selectedFields: string[];
  filters?: Record<string, string | number | boolean>;
}): Promise<Record<string, unknown>[]> {
  return apiRequest("/analytics/reports/run", { method: "POST", body: JSON.stringify(input) });
}

export function runSavedReport(id: string): Promise<{ definition: ReportDefinition; rows: Record<string, unknown>[] }> {
  return apiRequest(`/analytics/reports/${id}/run`);
}

/** Same-origin link — the session cookie rides along automatically, no fetch() needed. */
export function reportExportUrl(input: {
  entityType: ReportableEntityType;
  selectedFields: string[];
  filters?: Record<string, string | number | boolean>;
}): string {
  const params = new URLSearchParams({
    entityType: input.entityType,
    selectedFields: input.selectedFields.join(","),
  });
  if (input.filters && Object.keys(input.filters).length > 0) {
    params.set("filters", JSON.stringify(input.filters));
  }
  return `/api/v1/analytics/reports/export?${params.toString()}`;
}
