import { apiRequest } from "./http";
import type {
  ArrearEntry,
  Compensation,
  CreatePayComponentInput,
  EmployeePayComponent,
  FnfCase,
  PayComponent,
  Payslip,
  PayrollRun,
  PayrollRunWithResults,
  SetCompensationInput,
} from "./types";

export function listCompensation(): Promise<Compensation[]> {
  return apiRequest<Compensation[]>("/payroll/compensation");
}

export function setCompensation(input: SetCompensationInput): Promise<Compensation> {
  return apiRequest<Compensation>("/payroll/compensation", { method: "POST", body: JSON.stringify(input) });
}

export function listPayrollRuns(): Promise<PayrollRun[]> {
  return apiRequest<PayrollRun[]>("/payroll/runs");
}

export function getPayrollRun(id: string): Promise<PayrollRunWithResults> {
  return apiRequest<PayrollRunWithResults>(`/payroll/runs/${id}`);
}

export function createPayrollRun(periodYear: number, periodMonth: number): Promise<PayrollRun> {
  return apiRequest<PayrollRun>("/payroll/runs", { method: "POST", body: JSON.stringify({ periodYear, periodMonth }) });
}

export function processPayrollRun(id: string): Promise<PayrollRun> {
  return apiRequest<PayrollRun>(`/payroll/runs/${id}/process`, { method: "POST" });
}

export function approvePayrollRun(id: string): Promise<PayrollRun> {
  return apiRequest<PayrollRun>(`/payroll/runs/${id}/approve`, { method: "POST" });
}

export function closePayrollRun(id: string): Promise<PayrollRun> {
  return apiRequest<PayrollRun>(`/payroll/runs/${id}/close`, { method: "POST" });
}

export function listMyPayslips(): Promise<Payslip[]> {
  return apiRequest<Payslip[]>("/payroll/payslips/my");
}

export function getMyPayslip(year: number, month: number): Promise<Payslip> {
  return apiRequest<Payslip>(`/payroll/payslips/my/${year}/${month}`);
}

// Pay Components
export function listPayComponents(): Promise<PayComponent[]> {
  return apiRequest<PayComponent[]>("/payroll/pay-components");
}

export function createPayComponent(input: CreatePayComponentInput): Promise<PayComponent> {
  return apiRequest<PayComponent>("/payroll/pay-components", { method: "POST", body: JSON.stringify(input) });
}

export function assignPayComponent(input: { employeeId: string; payComponentId: string; value?: number }): Promise<EmployeePayComponent> {
  return apiRequest<EmployeePayComponent>("/payroll/pay-components/assign", { method: "POST", body: JSON.stringify(input) });
}

export function listEmployeePayComponents(employeeId: string): Promise<EmployeePayComponent[]> {
  return apiRequest<EmployeePayComponent[]>(`/payroll/pay-components/employee/${employeeId}`);
}

// Arrears
export function listEmployeeArrears(employeeId: string): Promise<ArrearEntry[]> {
  return apiRequest<ArrearEntry[]>(`/payroll/arrears/employee/${employeeId}`);
}

// Full & Final Settlement
export function listFnfCases(): Promise<FnfCase[]> {
  return apiRequest<FnfCase[]>("/payroll/fnf/cases");
}

export function createFnfCase(employeeId: string): Promise<FnfCase> {
  return apiRequest<FnfCase>("/payroll/fnf/cases", { method: "POST", body: JSON.stringify({ employeeId }) });
}

export function approveFnfCase(id: string): Promise<FnfCase> {
  return apiRequest<FnfCase>(`/payroll/fnf/cases/${id}/approve`, { method: "POST" });
}

export function releaseFnfCase(id: string): Promise<FnfCase> {
  return apiRequest<FnfCase>(`/payroll/fnf/cases/${id}/release`, { method: "POST" });
}

/** Same-origin link — the session cookie rides along automatically, no fetch() needed. Spec: 27-integration-platform/05-finance-systems-integration.md */
export function bankFileUrl(runId: string): string {
  return `/api/v1/payroll/runs/${runId}/bank-file`;
}

/** Per-employee salary advice letter — distinct from the bulk bank-file export above. Reuses the Document Generation engine; the raw record has fileId, not a nested file relation (that only exists on the list-for-employee query). */
export function generateBankAdvice(runId: string, employeeId: string): Promise<{ id: string; fileId: string }> {
  return apiRequest(`/payroll/runs/${runId}/employees/${employeeId}/bank-advice`, { method: "POST" });
}
