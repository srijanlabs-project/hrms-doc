import { apiRequest } from "./http";
import type {
  CarryForwardRunResult,
  CreateLeaveAdjustmentInput,
  CreateLeaveRequestInput,
  LeaveBalance,
  LeaveLedgerEntry,
  LeavePolicy,
  LeaveRequest,
} from "./types";

export function listLeavePolicies(): Promise<LeavePolicy[]> {
  return apiRequest<LeavePolicy[]>("/leave/policies");
}

export function listLeaveBalances(): Promise<LeaveBalance[]> {
  return apiRequest<LeaveBalance[]>("/leave/balances");
}

export function listMyLeaveRequests(): Promise<LeaveRequest[]> {
  return apiRequest<LeaveRequest[]>("/leave/requests/my");
}

export function listTeamLeaveRequests(status?: string): Promise<LeaveRequest[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<LeaveRequest[]>(`/leave/requests/team${query}`);
}

export function createLeaveRequest(input: CreateLeaveRequestInput): Promise<LeaveRequest> {
  return apiRequest<LeaveRequest>("/leave/requests", { method: "POST", body: JSON.stringify(input) });
}

export function approveLeaveRequest(id: string, note?: string): Promise<LeaveRequest> {
  return apiRequest<LeaveRequest>(`/leave/requests/${id}/approve`, { method: "POST", body: JSON.stringify({ note }) });
}

export function rejectLeaveRequest(id: string, note?: string): Promise<LeaveRequest> {
  return apiRequest<LeaveRequest>(`/leave/requests/${id}/reject`, { method: "POST", body: JSON.stringify({ note }) });
}

export function cancelLeaveRequest(id: string): Promise<{ cancelled: true }> {
  return apiRequest(`/leave/requests/${id}/cancel`, { method: "POST" });
}

export function getLeaveLedger(employeeId: string): Promise<LeaveLedgerEntry[]> {
  return apiRequest<LeaveLedgerEntry[]>(`/leave/ledger/${employeeId}`);
}

export function postLeaveAdjustment(input: CreateLeaveAdjustmentInput): Promise<LeaveLedgerEntry> {
  return apiRequest<LeaveLedgerEntry>("/leave/ledger/adjustments", { method: "POST", body: JSON.stringify(input) });
}

export function runLeaveCarryForward(fromYear: number): Promise<CarryForwardRunResult> {
  return apiRequest<CarryForwardRunResult>("/leave/ledger/carry-forward/run", {
    method: "POST",
    body: JSON.stringify({ fromYear }),
  });
}
