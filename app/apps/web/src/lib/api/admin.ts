import { apiRequest } from "./http";
import type { FeatureFlag, NumberSeries, SystemSetting, UpdateNumberSeriesInput, UpsertSystemSettingInput } from "./types";

export function listSystemSettings(): Promise<SystemSetting[]> {
  return apiRequest<SystemSetting[]>("/system-settings");
}

export function upsertSystemSetting(key: string, input: UpsertSystemSettingInput): Promise<SystemSetting> {
  return apiRequest<SystemSetting>(`/system-settings/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteSystemSetting(key: string): Promise<{ deleted: boolean }> {
  return apiRequest<{ deleted: boolean }>(`/system-settings/${encodeURIComponent(key)}`, { method: "DELETE" });
}

export function listNumberSeries(): Promise<NumberSeries[]> {
  return apiRequest<NumberSeries[]>("/number-series");
}

export function updateNumberSeries(id: string, input: UpdateNumberSeriesInput): Promise<NumberSeries> {
  return apiRequest<NumberSeries>(`/number-series/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function listFeatureFlags(): Promise<FeatureFlag[]> {
  return apiRequest<FeatureFlag[]>("/feature-flags");
}

export function createFeatureFlag(input: { key: string; name: string; description?: string }): Promise<FeatureFlag> {
  return apiRequest<FeatureFlag>("/feature-flags", { method: "POST", body: JSON.stringify(input) });
}

export function setFeatureFlagEnabled(key: string, enabled: boolean): Promise<FeatureFlag> {
  return apiRequest<FeatureFlag>(`/feature-flags/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify({ enabled }),
  });
}

export function deleteFeatureFlag(key: string): Promise<void> {
  return apiRequest<void>(`/feature-flags/${encodeURIComponent(key)}`, { method: "DELETE" });
}
