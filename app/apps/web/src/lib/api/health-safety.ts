import { apiRequest } from "./http";
import type {
  CompleteSafetyAssessmentInput,
  CreateEmergencyResponseContactInput,
  CreateHealthRecordInput,
  CreateSafetyAssessmentInput,
  CreateSafetyIncidentInput,
  EmergencyResponseContact,
  HealthRecord,
  SafetyAssessment,
  SafetyIncident,
} from "./types";

// Safety incidents
export function createSafetyIncident(input: CreateSafetyIncidentInput): Promise<SafetyIncident> {
  return apiRequest<SafetyIncident>("/health-safety/incidents", { method: "POST", body: JSON.stringify(input) });
}

export function listMySafetyIncidents(): Promise<SafetyIncident[]> {
  return apiRequest<SafetyIncident[]>("/health-safety/incidents/mine");
}

export function listAllSafetyIncidents(status?: string): Promise<SafetyIncident[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<SafetyIncident[]>(`/health-safety/incidents${query}`);
}

export function reviewSafetyIncident(id: string, investigationNotes: string): Promise<SafetyIncident> {
  return apiRequest<SafetyIncident>(`/health-safety/incidents/${id}/review`, {
    method: "POST",
    body: JSON.stringify({ investigationNotes }),
  });
}

export function resolveSafetyIncident(id: string): Promise<SafetyIncident> {
  return apiRequest<SafetyIncident>(`/health-safety/incidents/${id}/resolve`, { method: "POST" });
}

export function closeSafetyIncident(id: string): Promise<SafetyIncident> {
  return apiRequest<SafetyIncident>(`/health-safety/incidents/${id}/close`, { method: "POST" });
}

// Safety assessments
export function createSafetyAssessment(input: CreateSafetyAssessmentInput): Promise<SafetyAssessment> {
  return apiRequest<SafetyAssessment>("/health-safety/assessments", { method: "POST", body: JSON.stringify(input) });
}

export function listSafetyAssessments(status?: string): Promise<SafetyAssessment[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiRequest<SafetyAssessment[]>(`/health-safety/assessments${query}`);
}

export function completeSafetyAssessment(id: string, input: CompleteSafetyAssessmentInput): Promise<SafetyAssessment> {
  return apiRequest<SafetyAssessment>(`/health-safety/assessments/${id}/complete`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Health records
export function createHealthRecord(input: CreateHealthRecordInput): Promise<HealthRecord> {
  return apiRequest<HealthRecord>("/health-safety/health-records", { method: "POST", body: JSON.stringify(input) });
}

export function listMyHealthRecords(): Promise<HealthRecord[]> {
  return apiRequest<HealthRecord[]>("/health-safety/health-records/mine");
}

export function listAllHealthRecords(): Promise<HealthRecord[]> {
  return apiRequest<HealthRecord[]>("/health-safety/health-records");
}

// Emergency response contacts
export function listActiveEmergencyContacts(): Promise<EmergencyResponseContact[]> {
  return apiRequest<EmergencyResponseContact[]>("/health-safety/emergency-contacts");
}

export function listAllEmergencyContacts(): Promise<EmergencyResponseContact[]> {
  return apiRequest<EmergencyResponseContact[]>("/health-safety/emergency-contacts/all");
}

export function createEmergencyContact(input: CreateEmergencyResponseContactInput): Promise<EmergencyResponseContact> {
  return apiRequest<EmergencyResponseContact>("/health-safety/emergency-contacts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deactivateEmergencyContact(id: string): Promise<EmergencyResponseContact> {
  return apiRequest<EmergencyResponseContact>(`/health-safety/emergency-contacts/${id}/deactivate`, { method: "POST" });
}

export function activateEmergencyContact(id: string): Promise<EmergencyResponseContact> {
  return apiRequest<EmergencyResponseContact>(`/health-safety/emergency-contacts/${id}/activate`, { method: "POST" });
}
