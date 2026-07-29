import { apiRequest } from "./http";
import type { AssetAuditCycle, AssetAuditCycleWithItems } from "./types";

export function listAuditCycles(): Promise<AssetAuditCycle[]> {
  return apiRequest<AssetAuditCycle[]>("/assets/audits");
}

export function getAuditCycle(id: string): Promise<AssetAuditCycleWithItems> {
  return apiRequest<AssetAuditCycleWithItems>(`/assets/audits/${id}`);
}

export function startAuditCycle(periodLabel: string): Promise<AssetAuditCycleWithItems> {
  return apiRequest<AssetAuditCycleWithItems>("/assets/audits", { method: "POST", body: JSON.stringify({ periodLabel }) });
}

export function closeAuditCycle(id: string): Promise<AssetAuditCycle> {
  return apiRequest<AssetAuditCycle>(`/assets/audits/${id}/close`, { method: "POST" });
}

export function verifyAuditItem(itemId: string, notes?: string) {
  return apiRequest(`/assets/audits/items/${itemId}/verify`, { method: "POST", body: JSON.stringify({ notes }) });
}

export function markAuditItemMissing(itemId: string, notes?: string) {
  return apiRequest(`/assets/audits/items/${itemId}/missing`, { method: "POST", body: JSON.stringify({ notes }) });
}

export function markAuditItemDamaged(itemId: string, notes?: string) {
  return apiRequest(`/assets/audits/items/${itemId}/damaged`, { method: "POST", body: JSON.stringify({ notes }) });
}
