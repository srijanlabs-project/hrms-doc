import { apiRequest } from "./http";
import type { CompensationReviewCycle, CompensationReviewItem } from "./types";

export function listCycles(): Promise<CompensationReviewCycle[]> {
  return apiRequest<CompensationReviewCycle[]>("/compensation-planning/cycles");
}

export function createCycle(periodYear: number): Promise<CompensationReviewCycle> {
  return apiRequest<CompensationReviewCycle>("/compensation-planning/cycles", {
    method: "POST",
    body: JSON.stringify({ periodYear }),
  });
}

export function closeCycle(id: string): Promise<CompensationReviewCycle> {
  return apiRequest<CompensationReviewCycle>(`/compensation-planning/cycles/${id}/close`, { method: "POST" });
}

export function listItemsForCycle(cycleId: string): Promise<CompensationReviewItem[]> {
  return apiRequest<CompensationReviewItem[]>(`/compensation-planning/items?cycleId=${cycleId}`);
}

export function proposeItem(
  cycleId: string,
  employeeId: string,
  proposedMonthlyBasic: number,
): Promise<CompensationReviewItem> {
  return apiRequest<CompensationReviewItem>(`/compensation-planning/items?cycleId=${cycleId}`, {
    method: "POST",
    body: JSON.stringify({ employeeId, proposedMonthlyBasic }),
  });
}

export function approveItem(id: string): Promise<CompensationReviewItem> {
  return apiRequest<CompensationReviewItem>(`/compensation-planning/items/${id}/approve`, { method: "POST" });
}

export function applyItem(id: string): Promise<CompensationReviewItem> {
  return apiRequest<CompensationReviewItem>(`/compensation-planning/items/${id}/apply`, { method: "POST" });
}
