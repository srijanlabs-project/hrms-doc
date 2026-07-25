import { apiRequest } from "./http";

export interface UnifiedRequest {
  id: string;
  sourceType: "Leave" | "Expense" | "Travel";
  title: string;
  status: string;
  submittedAt: string;
  linkPath: string;
}

export interface RequestsSummary {
  total: number;
  pending: number;
}

export function listMyRequests(): Promise<UnifiedRequest[]> {
  return apiRequest("/ess/requests/mine");
}

export function getRequestsSummary(): Promise<RequestsSummary> {
  return apiRequest("/ess/requests/mine/summary");
}
