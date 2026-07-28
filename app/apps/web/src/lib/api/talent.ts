import { apiRequest } from "./http";
import type {
  AddSuccessorInput,
  CareerPlan,
  CreateCareerPlanInput,
  CreateCriticalRoleInput,
  CriticalRole,
  CriticalRoleWithRisk,
  Successor,
  TalentAssessment,
  UpsertTalentAssessmentInput,
} from "./types";

export function listTalentAssessments(periodYear: number): Promise<TalentAssessment[]> {
  return apiRequest<TalentAssessment[]>(`/talent/assessments?periodYear=${periodYear}`);
}

export function upsertTalentAssessment(input: UpsertTalentAssessmentInput): Promise<TalentAssessment> {
  return apiRequest<TalentAssessment>("/talent/assessments", { method: "POST", body: JSON.stringify(input) });
}

export function listCriticalRoles(): Promise<CriticalRole[]> {
  return apiRequest<CriticalRole[]>("/talent/succession/roles");
}

export function createCriticalRole(input: CreateCriticalRoleInput): Promise<CriticalRole> {
  return apiRequest<CriticalRole>("/talent/succession/roles", { method: "POST", body: JSON.stringify(input) });
}

export function deactivateCriticalRole(id: string): Promise<CriticalRole> {
  return apiRequest<CriticalRole>(`/talent/succession/roles/${id}/deactivate`, { method: "POST" });
}

export function addSuccessor(criticalRoleId: string, input: AddSuccessorInput): Promise<Successor> {
  return apiRequest<Successor>(`/talent/succession/roles/${criticalRoleId}/successors`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function removeSuccessor(id: string): Promise<Successor> {
  return apiRequest<Successor>(`/talent/succession/successors/${id}/remove`, { method: "POST" });
}

export function runSuccessionCoverageCheckNow(): Promise<{ triggered: boolean }> {
  return apiRequest<{ triggered: boolean }>("/talent/succession/run-now", { method: "POST" });
}

export function getWorkforcePlanningView(): Promise<CriticalRoleWithRisk[]> {
  return apiRequest<CriticalRoleWithRisk[]>("/talent/succession/workforce-planning");
}

export function createMyCareerPlan(input: CreateCareerPlanInput): Promise<CareerPlan> {
  return apiRequest<CareerPlan>("/talent/career-plans", { method: "POST", body: JSON.stringify(input) });
}

export function listMyCareerPlans(): Promise<CareerPlan[]> {
  return apiRequest<CareerPlan[]>("/talent/career-plans/mine");
}

export function listTeamCareerPlans(): Promise<CareerPlan[]> {
  return apiRequest<CareerPlan[]>("/talent/career-plans/team");
}

export function listAllCareerPlans(): Promise<CareerPlan[]> {
  return apiRequest<CareerPlan[]>("/talent/career-plans");
}

export function addCareerPlanAction(planId: string, title: string): Promise<CareerPlan> {
  return apiRequest<CareerPlan>(`/talent/career-plans/${planId}/actions`, { method: "POST", body: JSON.stringify({ title }) });
}

export function completeCareerPlanAction(actionId: string): Promise<CareerPlan> {
  return apiRequest<CareerPlan>(`/talent/career-plans/actions/${actionId}/complete`, { method: "POST" });
}

export function updateCareerPlanStatus(planId: string, status: string): Promise<CareerPlan> {
  return apiRequest<CareerPlan>(`/talent/career-plans/${planId}/status`, { method: "POST", body: JSON.stringify({ status }) });
}
