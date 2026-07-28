import { apiRequest } from "./http";
import type { ConsentRecord } from "./types";

export function listMyConsent(): Promise<ConsentRecord[]> {
  return apiRequest<ConsentRecord[]>("/consent/mine");
}

export function setMyConsent(purpose: string, status: "Granted" | "Revoked", notes?: string): Promise<ConsentRecord> {
  return apiRequest<ConsentRecord>(`/consent/mine/${encodeURIComponent(purpose)}`, {
    method: "PUT",
    body: JSON.stringify({ status, notes }),
  });
}

export function listAllConsent(): Promise<ConsentRecord[]> {
  return apiRequest<ConsentRecord[]>("/consent");
}
