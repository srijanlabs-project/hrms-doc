import { apiRequest } from "./http";
import type {
  CompensationReviewCycle,
  CompensationReviewItem,
  CreatePayoutCycleInput,
  PayoutPlanCycle,
  PayoutPlanItem,
  ProposePayoutItemInput,
} from "./types";

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

/** Wave 3 E14 gap closure — bonus planning + incentives. */
export function listPayoutCycles(): Promise<PayoutPlanCycle[]> {
  return apiRequest<PayoutPlanCycle[]>("/compensation-planning/payout-cycles");
}

export function createPayoutCycle(input: CreatePayoutCycleInput): Promise<PayoutPlanCycle> {
  return apiRequest<PayoutPlanCycle>("/compensation-planning/payout-cycles", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function closePayoutCycle(id: string): Promise<PayoutPlanCycle> {
  return apiRequest<PayoutPlanCycle>(`/compensation-planning/payout-cycles/${id}/close`, { method: "POST" });
}

export function listPayoutItemsForCycle(cycleId: string): Promise<PayoutPlanItem[]> {
  return apiRequest<PayoutPlanItem[]>(`/compensation-planning/payout-items?cycleId=${cycleId}`);
}

export function proposePayoutItem(cycleId: string, input: ProposePayoutItemInput): Promise<PayoutPlanItem> {
  return apiRequest<PayoutPlanItem>(`/compensation-planning/payout-items?cycleId=${cycleId}`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function approvePayoutItem(id: string): Promise<PayoutPlanItem> {
  return apiRequest<PayoutPlanItem>(`/compensation-planning/payout-items/${id}/approve`, { method: "POST" });
}

export function rejectPayoutItem(id: string, decisionNote?: string): Promise<PayoutPlanItem> {
  return apiRequest<PayoutPlanItem>(`/compensation-planning/payout-items/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ decisionNote }),
  });
}

export function postPayoutItem(id: string): Promise<PayoutPlanItem> {
  return apiRequest<PayoutPlanItem>(`/compensation-planning/payout-items/${id}/post`, { method: "POST" });
}
