import { apiRequest } from "./http";
import type { CreateEsopGrantInput, EsopGrant } from "./types";

/** Wave 3 E14 gap closure — ESOPs (grant + live vesting computation only). */
export function listMyEsopGrants(): Promise<EsopGrant[]> {
  return apiRequest<EsopGrant[]>("/compensation-planning/esop-grants/mine");
}

export function listAllEsopGrants(): Promise<EsopGrant[]> {
  return apiRequest<EsopGrant[]>("/compensation-planning/esop-grants");
}

export function createEsopGrant(input: CreateEsopGrantInput): Promise<EsopGrant> {
  return apiRequest<EsopGrant>("/compensation-planning/esop-grants", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function cancelEsopGrant(id: string): Promise<EsopGrant> {
  return apiRequest<EsopGrant>(`/compensation-planning/esop-grants/${id}/cancel`, { method: "POST" });
}
