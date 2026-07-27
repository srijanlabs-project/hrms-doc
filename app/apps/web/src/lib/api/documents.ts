import { apiRequest } from "./http";
import type {
  AddDocumentVersionInput,
  CreateDocumentInput,
  CreateRetentionPolicyInput,
  DocumentRecord,
  RetentionPolicy,
} from "./types";

export function createDocument(input: CreateDocumentInput): Promise<DocumentRecord> {
  return apiRequest<DocumentRecord>("/documents", { method: "POST", body: JSON.stringify(input) });
}

export function listMyDocuments(): Promise<DocumentRecord[]> {
  return apiRequest<DocumentRecord[]>("/documents/mine");
}

export function listAllDocuments(status?: string): Promise<DocumentRecord[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<DocumentRecord[]>(`/documents${query}`);
}

export function addDocumentVersion(id: string, input: AddDocumentVersionInput): Promise<DocumentRecord> {
  return apiRequest<DocumentRecord>(`/documents/${id}/versions`, { method: "POST", body: JSON.stringify(input) });
}

export function publishDocument(id: string): Promise<DocumentRecord> {
  return apiRequest<DocumentRecord>(`/documents/${id}/publish`, { method: "POST" });
}

export function archiveDocument(id: string): Promise<DocumentRecord> {
  return apiRequest<DocumentRecord>(`/documents/${id}/archive`, { method: "POST" });
}

export function createRetentionPolicy(input: CreateRetentionPolicyInput): Promise<RetentionPolicy> {
  return apiRequest<RetentionPolicy>("/documents/retention-policies", { method: "POST", body: JSON.stringify(input) });
}

export function listRetentionPolicies(): Promise<RetentionPolicy[]> {
  return apiRequest<RetentionPolicy[]>("/documents/retention-policies");
}
