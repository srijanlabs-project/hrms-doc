import { apiRequest } from "./http";
import type {
  AdminBenefitEnrollment,
  BenefitEnrollment,
  BenefitPlan,
  CreateBenefitPlanInput,
  EnrollBenefitInput,
  FlexBasketStatus,
} from "./types";

export function listActivePlans(): Promise<BenefitPlan[]> {
  return apiRequest<BenefitPlan[]>("/benefits/plans");
}

export function listAllPlans(): Promise<BenefitPlan[]> {
  return apiRequest<BenefitPlan[]>("/benefits/plans/admin");
}

export function createPlan(input: CreateBenefitPlanInput): Promise<BenefitPlan> {
  return apiRequest<BenefitPlan>("/benefits/plans", { method: "POST", body: JSON.stringify(input) });
}

export function getFlexBasketStatus(): Promise<FlexBasketStatus> {
  return apiRequest<FlexBasketStatus>("/benefits/flex-basket");
}

export function setFlexBasket(annualAmount: number): Promise<{ annualAmount: number }> {
  return apiRequest<{ annualAmount: number }>("/benefits/flex-basket", {
    method: "POST",
    body: JSON.stringify({ annualAmount }),
  });
}

export function listMyEnrollments(): Promise<BenefitEnrollment[]> {
  return apiRequest<BenefitEnrollment[]>("/benefits/enrollments/my");
}

export function listAllEnrollments(status?: string): Promise<AdminBenefitEnrollment[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<AdminBenefitEnrollment[]>(`/benefits/enrollments${query}`);
}

export function enrollInPlan(input: EnrollBenefitInput): Promise<BenefitEnrollment> {
  return apiRequest<BenefitEnrollment>("/benefits/enrollments", { method: "POST", body: JSON.stringify(input) });
}

export function waiveEnrollment(id: string, reason: string): Promise<BenefitEnrollment> {
  return apiRequest<BenefitEnrollment>(`/benefits/enrollments/${id}/waive`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function terminateEnrollment(id: string): Promise<BenefitEnrollment> {
  return apiRequest<BenefitEnrollment>(`/benefits/enrollments/${id}/terminate`, { method: "POST" });
}
