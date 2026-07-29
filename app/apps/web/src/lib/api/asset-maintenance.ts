import { apiRequest } from "./http";
import type { CreateMaintenanceRecordInput, MaintenanceRecord } from "./types";

export function listAllMaintenanceRecords(): Promise<MaintenanceRecord[]> {
  return apiRequest<MaintenanceRecord[]>("/assets/maintenance");
}

export function listMaintenanceForAsset(assetId: string): Promise<MaintenanceRecord[]> {
  return apiRequest<MaintenanceRecord[]>(`/assets/maintenance/asset/${assetId}`);
}

export function createMaintenanceRecord(input: CreateMaintenanceRecordInput): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>("/assets/maintenance", { method: "POST", body: JSON.stringify(input) });
}

export function completeMaintenanceRecord(id: string, notes?: string): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>(`/assets/maintenance/${id}/complete`, { method: "POST", body: JSON.stringify({ notes }) });
}

export function cancelMaintenanceRecord(id: string): Promise<MaintenanceRecord> {
  return apiRequest<MaintenanceRecord>(`/assets/maintenance/${id}/cancel`, { method: "POST" });
}
