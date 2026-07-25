import { apiRequest } from "./http";
import type { CreateExpenseClaimInput, ExpenseClaim } from "./types";

export function listMyExpenseClaims(): Promise<ExpenseClaim[]> {
  return apiRequest<ExpenseClaim[]>("/expense/claims/my");
}

export function listTeamExpenseClaims(): Promise<ExpenseClaim[]> {
  return apiRequest<ExpenseClaim[]>("/expense/claims/team");
}

export function listAllExpenseClaims(): Promise<ExpenseClaim[]> {
  return apiRequest<ExpenseClaim[]>("/expense/claims/all");
}

export function createExpenseClaim(input: CreateExpenseClaimInput): Promise<ExpenseClaim> {
  return apiRequest<ExpenseClaim>("/expense/claims", { method: "POST", body: JSON.stringify(input) });
}

export function approveExpenseClaim(id: string, note?: string): Promise<ExpenseClaim> {
  return apiRequest<ExpenseClaim>(`/expense/claims/${id}/approve`, { method: "POST", body: JSON.stringify({ note }) });
}

export function rejectExpenseClaim(id: string, note?: string): Promise<ExpenseClaim> {
  return apiRequest<ExpenseClaim>(`/expense/claims/${id}/reject`, { method: "POST", body: JSON.stringify({ note }) });
}

export function cancelExpenseClaim(id: string): Promise<{ cancelled: true }> {
  return apiRequest(`/expense/claims/${id}/cancel`, { method: "POST" });
}

export function markExpenseClaimPaid(id: string): Promise<ExpenseClaim> {
  return apiRequest<ExpenseClaim>(`/expense/claims/${id}/mark-paid`, { method: "POST" });
}
