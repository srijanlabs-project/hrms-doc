import { apiRequest } from "./http";
import type {
  AddDocumentInput,
  CreateVendorInput,
  CreateWorkerInput,
  ExternalWorker,
  ExternalWorkerDocument,
  ExternalWorkerWithDocuments,
  Vendor,
} from "./types";

export function createVendor(input: CreateVendorInput): Promise<Vendor> {
  return apiRequest<Vendor>("/contractor/vendors", { method: "POST", body: JSON.stringify(input) });
}

export function listVendors(): Promise<Vendor[]> {
  return apiRequest<Vendor[]>("/contractor/vendors");
}

export function createWorker(input: CreateWorkerInput): Promise<ExternalWorker> {
  return apiRequest<ExternalWorker>("/contractor/workers", { method: "POST", body: JSON.stringify(input) });
}

export function listWorkers(status?: string, vendorId?: string): Promise<ExternalWorker[]> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (vendorId) params.set("vendorId", vendorId);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<ExternalWorker[]>(`/contractor/workers${query}`);
}

export function getWorker(id: string): Promise<ExternalWorkerWithDocuments> {
  return apiRequest<ExternalWorkerWithDocuments>(`/contractor/workers/${id}`);
}

export function submitWorker(id: string): Promise<ExternalWorker> {
  return apiRequest<ExternalWorker>(`/contractor/workers/${id}/submit`, { method: "POST" });
}

export function approveWorker(id: string): Promise<ExternalWorker> {
  return apiRequest<ExternalWorker>(`/contractor/workers/${id}/approve`, { method: "POST" });
}

export function rejectWorker(id: string, reason: string): Promise<ExternalWorker> {
  return apiRequest<ExternalWorker>(`/contractor/workers/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) });
}

export function suspendWorker(id: string, reason: string): Promise<ExternalWorker> {
  return apiRequest<ExternalWorker>(`/contractor/workers/${id}/suspend`, { method: "POST", body: JSON.stringify({ reason }) });
}

export function reactivateWorker(id: string): Promise<ExternalWorker> {
  return apiRequest<ExternalWorker>(`/contractor/workers/${id}/reactivate`, { method: "POST" });
}

export function deactivateWorker(id: string): Promise<ExternalWorker> {
  return apiRequest<ExternalWorker>(`/contractor/workers/${id}/deactivate`, { method: "POST" });
}

export function addWorkerDocument(id: string, input: AddDocumentInput): Promise<ExternalWorkerDocument> {
  return apiRequest<ExternalWorkerDocument>(`/contractor/workers/${id}/documents`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function verifyWorkerDocument(documentId: string): Promise<ExternalWorkerDocument> {
  return apiRequest<ExternalWorkerDocument>(`/contractor/workers/documents/${documentId}/verify`, { method: "POST" });
}

export function runExpirySweepNow(): Promise<void> {
  return apiRequest<void>("/contractor/workers/expiry-sweep/run-now", { method: "POST" });
}
