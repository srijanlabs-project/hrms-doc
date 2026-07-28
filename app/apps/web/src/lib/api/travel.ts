import { apiRequest } from "./http";
import type {
  CreateItinerarySegmentInput,
  CreateTravelRequestInput,
  TravelAdvance,
  TravelItinerarySegment,
  TravelRequest,
  TravelSettlement,
} from "./types";

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

/** Wave 3 W4·E16 gap closure — trip planning + itinerary. */
export function listItinerarySegments(travelRequestId: string): Promise<TravelItinerarySegment[]> {
  return apiRequest<TravelItinerarySegment[]>(`/travel/requests/${travelRequestId}/itinerary`);
}

export function addItinerarySegment(
  travelRequestId: string,
  input: CreateItinerarySegmentInput,
): Promise<TravelItinerarySegment> {
  return apiRequest<TravelItinerarySegment>(`/travel/requests/${travelRequestId}/itinerary`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function removeItinerarySegment(travelRequestId: string, segmentId: string): Promise<void> {
  return apiRequest<void>(`/travel/requests/${travelRequestId}/itinerary/${segmentId}`, { method: "DELETE" });
}

/** Wave 3 W4·E16 gap closure — travel advances. */
export function requestTravelAdvance(travelRequestId: string, requestedAmount: number): Promise<TravelAdvance> {
  return apiRequest<TravelAdvance>(`/travel/advances?travelRequestId=${travelRequestId}`, {
    method: "POST",
    body: JSON.stringify({ requestedAmount }),
  });
}

export function listAdvancesForTravelRequest(travelRequestId: string): Promise<TravelAdvance[]> {
  return apiRequest<TravelAdvance[]>(`/travel/advances?travelRequestId=${travelRequestId}`);
}

export function listMyTravelAdvances(): Promise<TravelAdvance[]> {
  return apiRequest<TravelAdvance[]>("/travel/advances/my");
}

export function listAllTravelAdvancesAdmin(): Promise<TravelAdvance[]> {
  return apiRequest<TravelAdvance[]>("/travel/advances/all");
}

export function approveTravelAdvance(id: string, approvedAmount?: number): Promise<TravelAdvance> {
  return apiRequest<TravelAdvance>(`/travel/advances/${id}/approve`, { method: "POST", body: JSON.stringify({ approvedAmount }) });
}

export function rejectTravelAdvance(id: string, note?: string): Promise<TravelAdvance> {
  return apiRequest<TravelAdvance>(`/travel/advances/${id}/reject`, { method: "POST", body: JSON.stringify({ note }) });
}

export function disburseTravelAdvance(id: string): Promise<TravelAdvance> {
  return apiRequest<TravelAdvance>(`/travel/advances/${id}/disburse`, { method: "POST" });
}

/** Wave 3 W4·E16 gap closure — travel expense settlement (always computed live). */
export function getTravelSettlement(travelRequestId: string): Promise<TravelSettlement> {
  return apiRequest<TravelSettlement>(`/travel/requests/${travelRequestId}/settlement`);
}
