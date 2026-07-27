import { apiRequest } from "./http";

export interface BackupRecord {
  id: string;
  status: "Succeeded" | "Failed";
  triggeredBy: "Manual" | "Scheduled";
  tableCounts: Record<string, number>;
  errorMessage: string | null;
  createdAt: string;
  file: { id: string; originalName: string; sizeBytes: number } | null;
}

export interface BackupPreview {
  valid: boolean;
  reason?: string;
  recomputedCounts?: Record<string, number>;
  matchesRecordedCounts?: boolean;
  snapshotCreatedAt?: string;
}

export function runBackupNow(): Promise<BackupRecord> {
  return apiRequest("/ops/backups", { method: "POST" });
}

export function listBackupRecords(): Promise<BackupRecord[]> {
  return apiRequest("/ops/backups");
}

export function previewBackupRestore(id: string): Promise<BackupPreview> {
  return apiRequest(`/ops/backups/${id}/preview`);
}

export interface SystemHealth {
  service: string;
  status: "up" | "down";
  database: "up" | "down";
  time: string;
}

/** Bypasses apiRequest deliberately: a 503 "down" response is a valid, informative result here, not an ApiError to throw. */
export async function getSystemHealth(): Promise<SystemHealth> {
  const res = await fetch("/api/v1/health");
  const body = (await res.json()) as { data: SystemHealth };
  return body.data;
}
