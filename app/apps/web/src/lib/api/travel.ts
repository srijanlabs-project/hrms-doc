import { apiRequest } from "./http";
import type { CreateTravelRequestInput, TravelRequest } from "./types";

export function listMyTravelRequests(): Promise<TravelRequest[]> {
  return apiRequest<TravelRequest[]>("/travel/requests/my");
}

export function listTeamTravelRequests(): Promise<TravelRequest[]> {
  return apiRequest<TravelRequest[]>("/travel/requests/team");
}

export function listAllTravelRequests(): Promise<TravelRequest[]> {
  return apiRequest<TravelRequest[]>("/travel/requests/all");
}

export function createTravelRequest(input: CreateTravelRequestInput): Promise<TravelRequest> {
  return apiRequest<TravelRequest>("/travel/requests", { method: "POST", body: JSON.stringify(input) });
}

export function approveTravelRequest(id: string, note?: string): Promise<TravelRequest> {
  return apiRequest<TravelRequest>(`/travel/requests/${id}/approve`, { method: "POST", body: JSON.stringify({ note }) });
}

export function rejectTravelRequest(id: string, note?: string): Promise<TravelRequest> {
  return apiRequest<TravelRequest>(`/travel/requests/${id}/reject`, { method: "POST", body: JSON.stringify({ note }) });
}

export function cancelTravelRequest(id: string): Promise<{ cancelled: true }> {
  return apiRequest(`/travel/requests/${id}/cancel`, { method: "POST" });
}

export function markTravelRequestCompleted(id: string): Promise<TravelRequest> {
  return apiRequest<TravelRequest>(`/travel/requests/${id}/mark-completed`, { method: "POST" });
}
