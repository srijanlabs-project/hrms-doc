import { apiRequest } from "./http";
import type { ComplianceObligation, ComplianceTask, CreateObligationInput } from "./types";

export function listObligations(): Promise<ComplianceObligation[]> {
  return apiRequest<ComplianceObligation[]>("/compliance/obligations");
}

export function createObligation(input: CreateObligationInput): Promise<ComplianceObligation> {
  return apiRequest<ComplianceObligation>("/compliance/obligations", { method: "POST", body: JSON.stringify(input) });
}

export function listTasks(status?: string): Promise<ComplianceTask[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<ComplianceTask[]>(`/compliance/tasks${query}`);
}

export function completeTask(id: string, note?: string, evidenceFileId?: string): Promise<ComplianceTask> {
  return apiRequest<ComplianceTask>(`/compliance/tasks/${id}/complete`, {
    method: "POST",
    body: JSON.stringify({ note, evidenceFileId }),
  });
}

export function waiveTask(id: string, note: string): Promise<ComplianceTask> {
  return apiRequest<ComplianceTask>(`/compliance/tasks/${id}/waive`, { method: "POST", body: JSON.stringify({ note }) });
}

export function generateNow(): Promise<{ triggered: true }> {
  return apiRequest("/compliance/generate-now", { method: "POST" });
}
