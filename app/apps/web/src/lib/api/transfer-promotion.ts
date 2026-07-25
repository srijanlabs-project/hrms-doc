import { apiRequest } from "./http";

export type ChangeType = "Transfer" | "Promotion" | "Demotion";
export type TransferPromotionStatus = "Proposed" | "Approved" | "Applied" | "Rejected";

export interface TransferPromotionRequest {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string };
  requestedByUserId: string;
  changeType: ChangeType;
  toDepartmentId: string | null;
  toDepartment: { id: string; name: string } | null;
  toDesignationId: string | null;
  toDesignation: { id: string; title: string } | null;
  toGradeId: string | null;
  toGrade: { id: string; name: string } | null;
  effectiveDate: string;
  reason: string;
  status: TransferPromotionStatus;
  decidedByUserId: string | null;
  decisionNote: string | null;
  appliedAt: string | null;
  createdAt: string;
}

export interface CreateTransferPromotionInput {
  employeeId: string;
  changeType: ChangeType;
  toDepartmentId?: string;
  toDesignationId?: string;
  toGradeId?: string;
  effectiveDate: string;
  reason: string;
}

export function proposeTransferPromotion(input: CreateTransferPromotionInput): Promise<TransferPromotionRequest> {
  return apiRequest<TransferPromotionRequest>("/mss/transfer-promotion", { method: "POST", body: JSON.stringify(input) });
}

export function listMyTransferPromotionRequests(): Promise<TransferPromotionRequest[]> {
  return apiRequest<TransferPromotionRequest[]>("/mss/transfer-promotion/mine");
}

export function listAllTransferPromotionRequests(status?: string): Promise<TransferPromotionRequest[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<TransferPromotionRequest[]>(`/mss/transfer-promotion/all${query}`);
}

export function approveTransferPromotion(id: string): Promise<TransferPromotionRequest> {
  return apiRequest<TransferPromotionRequest>(`/mss/transfer-promotion/${id}/approve`, { method: "POST" });
}

export function rejectTransferPromotion(id: string, decisionNote: string): Promise<TransferPromotionRequest> {
  return apiRequest<TransferPromotionRequest>(`/mss/transfer-promotion/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ decisionNote }),
  });
}

export function applyTransferPromotion(id: string): Promise<TransferPromotionRequest> {
  return apiRequest<TransferPromotionRequest>(`/mss/transfer-promotion/${id}/apply`, { method: "POST" });
}
