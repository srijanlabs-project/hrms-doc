import { apiRequest } from "./http";
import type { OnboardingCase } from "./types";

export function getMyOnboardingCase(): Promise<OnboardingCase> {
  return apiRequest<OnboardingCase>("/onboarding/my");
}

export function completeMyTask(taskId: string): Promise<OnboardingCase["tasks"][number]> {
  return apiRequest(`/onboarding/tasks/${taskId}/complete`, { method: "POST" });
}

export function listOnboardingCases(): Promise<OnboardingCase[]> {
  return apiRequest<OnboardingCase[]>("/onboarding/cases");
}

export function getOnboardingCase(id: string): Promise<OnboardingCase> {
  return apiRequest<OnboardingCase>(`/onboarding/cases/${id}`);
}

export function activateOnboardingCase(id: string): Promise<OnboardingCase> {
  return apiRequest<OnboardingCase>(`/onboarding/cases/${id}/activate`, { method: "POST" });
}

export function waiveOnboardingTask(taskId: string): Promise<OnboardingCase["tasks"][number]> {
  return apiRequest(`/onboarding/cases/tasks/${taskId}/waive`, { method: "POST" });
}
