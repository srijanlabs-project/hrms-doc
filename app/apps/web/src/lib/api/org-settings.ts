import { apiRequest } from "./http";
import type {
  AddCalendarDayInput,
  Company,
  CreateCompanyInput,
  CreateDesignationInput,
  CreateFinancialCenterInput,
  CreateGradeInput,
  CreateJobFamilyInput,
  CreateJobFunctionInput,
  CreateOrgPolicyInput,
  CreateOrgUnitInput,
  CreatePositionInput,
  CreateReportingLineInput,
  CreateWorkCalendarInput,
  Designation,
  FinancialCenter,
  Grade,
  JobFamily,
  JobFunction,
  OrgPolicy,
  OrgTree,
  OrgUnit,
  Position,
  ReportingLine,
  WorkCalendar,
  WorkCalendarAssignment,
} from "./types";

export function listCompanies(): Promise<Company[]> {
  return apiRequest<Company[]>("/org/companies");
}
export function createCompany(input: CreateCompanyInput): Promise<Company> {
  return apiRequest<Company>("/org/companies", { method: "POST", body: JSON.stringify(input) });
}

export function listOrgUnits(): Promise<OrgUnit[]> {
  return apiRequest<OrgUnit[]>("/org/org-units");
}
export function createOrgUnit(input: CreateOrgUnitInput): Promise<OrgUnit> {
  return apiRequest<OrgUnit>("/org/org-units", { method: "POST", body: JSON.stringify(input) });
}

export function listFinancialCenters(): Promise<FinancialCenter[]> {
  return apiRequest<FinancialCenter[]>("/org/financial-centers");
}
export function createFinancialCenter(input: CreateFinancialCenterInput): Promise<FinancialCenter> {
  return apiRequest<FinancialCenter>("/org/financial-centers", { method: "POST", body: JSON.stringify(input) });
}

export function listReportingLines(): Promise<ReportingLine[]> {
  return apiRequest<ReportingLine[]>("/org/reporting-lines");
}
export function createReportingLine(input: CreateReportingLineInput): Promise<ReportingLine> {
  return apiRequest<ReportingLine>("/org/reporting-lines", { method: "POST", body: JSON.stringify(input) });
}
export function endReportingLine(id: string): Promise<ReportingLine> {
  return apiRequest<ReportingLine>(`/org/reporting-lines/${id}/end`, { method: "POST" });
}

export function listJobFamilies(): Promise<JobFamily[]> {
  return apiRequest<JobFamily[]>("/org/job-families");
}
export function createJobFamily(input: CreateJobFamilyInput): Promise<JobFamily> {
  return apiRequest<JobFamily>("/org/job-families", { method: "POST", body: JSON.stringify(input) });
}

export function listJobFunctions(): Promise<JobFunction[]> {
  return apiRequest<JobFunction[]>("/org/job-functions");
}
export function createJobFunction(input: CreateJobFunctionInput): Promise<JobFunction> {
  return apiRequest<JobFunction>("/org/job-functions", { method: "POST", body: JSON.stringify(input) });
}

export function listDesignations(): Promise<Designation[]> {
  return apiRequest<Designation[]>("/org/designations");
}
export function createDesignation(input: CreateDesignationInput): Promise<Designation> {
  return apiRequest<Designation>("/org/designations", { method: "POST", body: JSON.stringify(input) });
}

export function listGrades(): Promise<Grade[]> {
  return apiRequest<Grade[]>("/org/grades");
}
export function createGrade(input: CreateGradeInput): Promise<Grade> {
  return apiRequest<Grade>("/org/grades", { method: "POST", body: JSON.stringify(input) });
}

export function listPositions(): Promise<Position[]> {
  return apiRequest<Position[]>("/org/positions");
}
export function createPosition(input: CreatePositionInput): Promise<Position> {
  return apiRequest<Position>("/org/positions", { method: "POST", body: JSON.stringify(input) });
}
export function updatePositionStatus(id: string, status: string): Promise<Position> {
  return apiRequest<Position>(`/org/positions/${id}/status`, { method: "POST", body: JSON.stringify({ status }) });
}

export function listWorkCalendars(): Promise<WorkCalendar[]> {
  return apiRequest<WorkCalendar[]>("/org/work-calendars");
}
export function createWorkCalendar(input: CreateWorkCalendarInput): Promise<WorkCalendar> {
  return apiRequest<WorkCalendar>("/org/work-calendars", { method: "POST", body: JSON.stringify(input) });
}
export function publishWorkCalendar(id: string): Promise<WorkCalendar> {
  return apiRequest<WorkCalendar>(`/org/work-calendars/${id}/publish`, { method: "POST" });
}
export function addCalendarDay(calendarId: string, input: AddCalendarDayInput) {
  return apiRequest(`/org/work-calendars/${calendarId}/days`, { method: "POST", body: JSON.stringify(input) });
}
export function assignCalendar(calendarId: string, scope: string, scopeId?: string): Promise<WorkCalendarAssignment> {
  return apiRequest<WorkCalendarAssignment>(`/org/work-calendars/${calendarId}/assign`, {
    method: "POST",
    body: JSON.stringify({ scope, scopeId }),
  });
}
export function listCalendarAssignments(): Promise<WorkCalendarAssignment[]> {
  return apiRequest<WorkCalendarAssignment[]>("/org/work-calendars/assignments");
}

export function listOrgPolicies(): Promise<OrgPolicy[]> {
  return apiRequest<OrgPolicy[]>("/org/policies");
}
export function createOrgPolicy(input: CreateOrgPolicyInput): Promise<OrgPolicy> {
  return apiRequest<OrgPolicy>("/org/policies", { method: "POST", body: JSON.stringify(input) });
}
export function archiveOrgPolicy(id: string): Promise<OrgPolicy> {
  return apiRequest<OrgPolicy>(`/org/policies/${id}/archive`, { method: "POST" });
}

export function getOrgTree(): Promise<OrgTree> {
  return apiRequest<OrgTree>("/org/tree");
}
