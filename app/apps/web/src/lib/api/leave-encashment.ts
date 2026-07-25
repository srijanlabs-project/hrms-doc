import { apiRequest } from "./http";

export interface LeaveEncashmentRequest {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string };
  leaveType: string;
  days: number;
  ratePerDay: number;
  amount: number;
  reason: string | null;
  status: "Pending" | "Approved" | "Rejected";
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface CreateEncashmentInput {
  leaveType: string;
  days: number;
  reason?: string;
}

export function createEncashmentRequest(input: CreateEncashmentInput): Promise<LeaveEncashmentRequest> {
  return apiRequest<LeaveEncashmentRequest>("/leave/encashment", { method: "POST", body: JSON.stringify(input) });
}

export function listMyEncashmentRequests(): Promise<LeaveEncashmentRequest[]> {
  return apiRequest<LeaveEncashmentRequest[]>("/leave/encashment/mine");
}

export function listAllEncashmentRequests(status?: string): Promise<LeaveEncashmentRequest[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<LeaveEncashmentRequest[]>(`/leave/encashment/all${query}`);
}

export function approveEncashmentRequest(id: string): Promise<LeaveEncashmentRequest> {
  return apiRequest<LeaveEncashmentRequest>(`/leave/encashment/${id}/approve`, { method: "POST" });
}

export function rejectEncashmentRequest(id: string, decisionNote: string): Promise<LeaveEncashmentRequest> {
  return apiRequest<LeaveEncashmentRequest>(`/leave/encashment/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ decisionNote }),
  });
}
