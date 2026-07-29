import { apiRequest } from "./http";
import type { CreatePerDiemPolicyInput, PerDiemClaim, PerDiemPolicy, SubmitPerDiemClaimInput } from "./types";

export function listActivePerDiemPolicies(): Promise<PerDiemPolicy[]> {
  return apiRequest<PerDiemPolicy[]>("/expense/per-diem-policies");
}

export function listAllPerDiemPolicies(): Promise<PerDiemPolicy[]> {
  return apiRequest<PerDiemPolicy[]>("/expense/per-diem-policies/all");
}

export function createPerDiemPolicy(input: CreatePerDiemPolicyInput): Promise<PerDiemPolicy> {
  return apiRequest<PerDiemPolicy>("/expense/per-diem-policies", { method: "POST", body: JSON.stringify(input) });
}

export function listMyPerDiemClaims(): Promise<PerDiemClaim[]> {
  return apiRequest<PerDiemClaim[]>("/expense/per-diem-claims/my");
}

export function listTeamPerDiemClaims(): Promise<PerDiemClaim[]> {
  return apiRequest<PerDiemClaim[]>("/expense/per-diem-claims/team");
}

export function listAllPerDiemClaims(): Promise<PerDiemClaim[]> {
  return apiRequest<PerDiemClaim[]>("/expense/per-diem-claims/all");
}

export function submitPerDiemClaim(input: SubmitPerDiemClaimInput): Promise<PerDiemClaim> {
  return apiRequest<PerDiemClaim>("/expense/per-diem-claims", { method: "POST", body: JSON.stringify(input) });
}

export function approvePerDiemClaim(id: string, note?: string): Promise<PerDiemClaim> {
  return apiRequest<PerDiemClaim>(`/expense/per-diem-claims/${id}/approve`, { method: "POST", body: JSON.stringify({ note }) });
}

export function rejectPerDiemClaim(id: string, note?: string): Promise<PerDiemClaim> {
  return apiRequest<PerDiemClaim>(`/expense/per-diem-claims/${id}/reject`, { method: "POST", body: JSON.stringify({ note }) });
}

export function markPerDiemClaimPaid(id: string): Promise<PerDiemClaim> {
  return apiRequest<PerDiemClaim>(`/expense/per-diem-claims/${id}/mark-paid`, { method: "POST" });
}
