import { apiRequest } from "./http";

export const IMPORTABLE_ENTITY_TYPES = ["Employee", "Department", "LegalEntity", "LeavePolicy"] as const;
export type ImportableEntityType = (typeof IMPORTABLE_ENTITY_TYPES)[number];

export interface ImportRowResult {
  index: number;
  success: boolean;
  error?: string;
  label?: string;
  createdEntityId?: string;
}

export interface ImportBatchRow {
  id: string;
  rowIndex: number;
  success: boolean;
  errorMessage: string | null;
  createdEntityId: string | null;
}

export interface ImportBatch {
  id: string;
  entityType: ImportableEntityType;
  status: "Committed" | "RolledBack";
  totalRows: number;
  successCount: number;
  failureCount: number;
  createdAt: string;
  rolledBackAt: string | null;
  rows?: ImportBatchRow[];
}

export type RunImportBatchResult = { dryRun: true; results: ImportRowResult[] } | { dryRun: false; batch: ImportBatch };

export function runImportBatch(entityType: ImportableEntityType, rows: Record<string, unknown>[], dryRun: boolean): Promise<RunImportBatchResult> {
  return apiRequest("/implementation/import-batches", { method: "POST", body: JSON.stringify({ entityType, rows, dryRun }) });
}

export function listImportBatches(): Promise<ImportBatch[]> {
  return apiRequest("/implementation/import-batches");
}

export function rollbackImportBatch(id: string): Promise<ImportBatch> {
  return apiRequest(`/implementation/import-batches/${id}/rollback`, { method: "POST" });
}

export interface GoLiveChecklistItem {
  id: string;
  key: string;
  label: string;
  completed: boolean;
  completedAt: string | null;
}

export function listGoLiveChecklist(): Promise<GoLiveChecklistItem[]> {
  return apiRequest("/implementation/checklist");
}

export function setGoLiveChecklistItem(key: string, completed: boolean): Promise<GoLiveChecklistItem> {
  return apiRequest(`/implementation/checklist/${key}`, { method: "PATCH", body: JSON.stringify({ completed }) });
}

/** Same-origin link — the session cookie rides along automatically, no fetch() needed. */
export function bulkExportUrl(entityType: ImportableEntityType): string {
  return `/api/v1/implementation/export?entityType=${encodeURIComponent(entityType)}`;
}
