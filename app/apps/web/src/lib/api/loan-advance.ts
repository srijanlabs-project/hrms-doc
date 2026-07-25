import { apiRequest } from "./http";

export type LoanAdvanceType = "Loan" | "Advance";
export type LoanAdvanceStatus = "Requested" | "Approved" | "Rejected" | "Active" | "Closed";

export interface LoanAdvanceRequest {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string };
  type: LoanAdvanceType;
  principal: number;
  monthlyInstallment: number;
  outstandingBalance: number;
  reason: string | null;
  status: LoanAdvanceStatus;
  decisionNote: string | null;
  decidedAt: string | null;
  closedAt: string | null;
  createdAt: string;
}

export interface CreateLoanAdvanceInput {
  type: LoanAdvanceType;
  principal: number;
  monthlyInstallment: number;
  reason?: string;
}

export function createLoanAdvanceRequest(input: CreateLoanAdvanceInput): Promise<LoanAdvanceRequest> {
  return apiRequest<LoanAdvanceRequest>("/payroll/loans", { method: "POST", body: JSON.stringify(input) });
}

export function listMyLoanAdvanceRequests(): Promise<LoanAdvanceRequest[]> {
  return apiRequest<LoanAdvanceRequest[]>("/payroll/loans/mine");
}

export function listAllLoanAdvanceRequests(status?: string): Promise<LoanAdvanceRequest[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<LoanAdvanceRequest[]>(`/payroll/loans/all${query}`);
}

export function approveLoanAdvanceRequest(id: string): Promise<LoanAdvanceRequest> {
  return apiRequest<LoanAdvanceRequest>(`/payroll/loans/${id}/approve`, { method: "POST" });
}

export function rejectLoanAdvanceRequest(id: string, decisionNote: string): Promise<LoanAdvanceRequest> {
  return apiRequest<LoanAdvanceRequest>(`/payroll/loans/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ decisionNote }),
  });
}
