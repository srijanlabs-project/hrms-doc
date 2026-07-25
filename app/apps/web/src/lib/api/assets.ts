import { apiRequest } from "./http";
import type { Asset, AssetAssignment, CreateAssetInput } from "./types";

export function listAssets(): Promise<Asset[]> {
  return apiRequest<Asset[]>("/assets");
}

export function createAsset(input: CreateAssetInput): Promise<Asset> {
  return apiRequest<Asset>("/assets", { method: "POST", body: JSON.stringify(input) });
}

export function listMyAssetAssignments(): Promise<AssetAssignment[]> {
  return apiRequest<AssetAssignment[]>("/assets/assignments/my");
}

export function listAllAssetAssignments(): Promise<AssetAssignment[]> {
  return apiRequest<AssetAssignment[]>("/assets/assignments/all");
}

export function assignAsset(assetId: string, employeeId: string): Promise<AssetAssignment> {
  return apiRequest<AssetAssignment>("/assets/assignments", { method: "POST", body: JSON.stringify({ assetId, employeeId }) });
}

export function returnAsset(assignmentId: string, condition: string, notes?: string): Promise<AssetAssignment> {
  return apiRequest<AssetAssignment>(`/assets/assignments/${assignmentId}/return`, {
    method: "POST",
    body: JSON.stringify({ condition, notes }),
  });
}
