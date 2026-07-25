import { apiRequest } from "./http";
import type {
  BackgroundBundle,
  CareerBundle,
  CreateBankAccountInput,
  CreateCertificationInput,
  CreateContractRenewalInput,
  CreateEducationInput,
  CreateEmergencyContactInput,
  CreateEmployeeDocumentInput,
  CreateIdentityDocumentInput,
  CreateMovementInput,
  CreatePriorExperienceInput,
  CreateProbationInput,
  CreateSalaryRevisionInput,
  CreateSkillInput,
  DecideProbationInput,
  IdentityFinanceBundle,
  PersonalDetailBundle,
  SalaryRevision,
  TimelineEvent,
  UpsertPersonalDetailInput,
  UpsertTaxProfileInput,
} from "./types";

const base = (employeeId: string) => `/people/employees/${employeeId}`;

export function getPersonalDetail(employeeId: string): Promise<PersonalDetailBundle> {
  return apiRequest<PersonalDetailBundle>(`${base(employeeId)}/personal-detail`);
}
export function upsertPersonalDetail(employeeId: string, input: UpsertPersonalDetailInput) {
  return apiRequest(`${base(employeeId)}/personal-detail`, { method: "PUT", body: JSON.stringify(input) });
}
export function addEmergencyContact(employeeId: string, input: CreateEmergencyContactInput) {
  return apiRequest(`${base(employeeId)}/personal-detail/emergency-contacts`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function removeEmergencyContact(employeeId: string, id: string) {
  return apiRequest(`${base(employeeId)}/personal-detail/emergency-contacts/${id}`, { method: "DELETE" });
}

export function getIdentityFinance(employeeId: string): Promise<IdentityFinanceBundle> {
  return apiRequest<IdentityFinanceBundle>(`${base(employeeId)}/identity-finance`);
}
export function addIdentityDocument(employeeId: string, input: CreateIdentityDocumentInput) {
  return apiRequest(`${base(employeeId)}/identity-documents`, { method: "POST", body: JSON.stringify(input) });
}
export function addBankAccount(employeeId: string, input: CreateBankAccountInput) {
  return apiRequest(`${base(employeeId)}/bank-accounts`, { method: "POST", body: JSON.stringify(input) });
}
export function upsertTaxProfile(employeeId: string, input: UpsertTaxProfileInput) {
  return apiRequest(`${base(employeeId)}/tax-profile`, { method: "PUT", body: JSON.stringify(input) });
}

export function getBackground(employeeId: string): Promise<BackgroundBundle> {
  return apiRequest<BackgroundBundle>(`${base(employeeId)}/background`);
}
export function addCertification(employeeId: string, input: CreateCertificationInput) {
  return apiRequest(`${base(employeeId)}/certifications`, { method: "POST", body: JSON.stringify(input) });
}
export function addSkill(employeeId: string, input: CreateSkillInput) {
  return apiRequest(`${base(employeeId)}/skills`, { method: "POST", body: JSON.stringify(input) });
}
export function addEducation(employeeId: string, input: CreateEducationInput) {
  return apiRequest(`${base(employeeId)}/education`, { method: "POST", body: JSON.stringify(input) });
}
export function addPriorExperience(employeeId: string, input: CreatePriorExperienceInput) {
  return apiRequest(`${base(employeeId)}/experience`, { method: "POST", body: JSON.stringify(input) });
}

export function getCareer(employeeId: string): Promise<CareerBundle> {
  return apiRequest<CareerBundle>(`${base(employeeId)}/career`);
}
export function createMovement(employeeId: string, input: CreateMovementInput) {
  return apiRequest(`${base(employeeId)}/movements`, { method: "POST", body: JSON.stringify(input) });
}
export function createProbation(employeeId: string, input: CreateProbationInput) {
  return apiRequest(`${base(employeeId)}/probation`, { method: "POST", body: JSON.stringify(input) });
}
export function decideProbation(employeeId: string, id: string, input: DecideProbationInput) {
  return apiRequest(`${base(employeeId)}/probation/${id}/decide`, { method: "POST", body: JSON.stringify(input) });
}
export function createContractRenewal(employeeId: string, input: CreateContractRenewalInput) {
  return apiRequest(`${base(employeeId)}/contract-renewals`, { method: "POST", body: JSON.stringify(input) });
}
export function addEmployeeDocument(employeeId: string, input: CreateEmployeeDocumentInput) {
  return apiRequest(`${base(employeeId)}/documents`, { method: "POST", body: JSON.stringify(input) });
}

export function listSalaryRevisions(employeeId: string): Promise<SalaryRevision[]> {
  return apiRequest<SalaryRevision[]>(`${base(employeeId)}/salary-revisions`);
}
export function proposeSalaryRevision(employeeId: string, input: CreateSalaryRevisionInput) {
  return apiRequest(`${base(employeeId)}/salary-revisions`, { method: "POST", body: JSON.stringify(input) });
}
export function approveSalaryRevision(id: string, note?: string) {
  return apiRequest(`/people/salary-revisions/${id}/approve`, { method: "POST", body: JSON.stringify({ note }) });
}
export function rejectSalaryRevision(id: string, note?: string) {
  return apiRequest(`/people/salary-revisions/${id}/reject`, { method: "POST", body: JSON.stringify({ note }) });
}
export function applySalaryRevision(id: string) {
  return apiRequest(`/people/salary-revisions/${id}/apply`, { method: "POST" });
}

export function getTimeline(employeeId: string): Promise<TimelineEvent[]> {
  return apiRequest<TimelineEvent[]>(`${base(employeeId)}/timeline`);
}
