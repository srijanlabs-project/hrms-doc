import { apiRequest } from "./http";
import type { CreateLicenseInput, LicenseAssignment, SoftwareLicense } from "./types";

export function listAllLicenses(): Promise<SoftwareLicense[]> {
  return apiRequest<SoftwareLicense[]>("/assets/licenses");
}

export function listActiveLicenses(): Promise<SoftwareLicense[]> {
  return apiRequest<SoftwareLicense[]>("/assets/licenses/active");
}

export function createLicense(input: CreateLicenseInput): Promise<SoftwareLicense> {
  return apiRequest<SoftwareLicense>("/assets/licenses", { method: "POST", body: JSON.stringify(input) });
}

export function assignLicense(licenseId: string, employeeId: string): Promise<LicenseAssignment> {
  return apiRequest<LicenseAssignment>("/assets/licenses/assign", { method: "POST", body: JSON.stringify({ licenseId, employeeId }) });
}

export function revokeLicenseAssignment(id: string): Promise<LicenseAssignment> {
  return apiRequest<LicenseAssignment>(`/assets/licenses/assignments/${id}/revoke`, { method: "POST" });
}

export function listMyLicenseAssignments(): Promise<LicenseAssignment[]> {
  return apiRequest<LicenseAssignment[]>("/assets/licenses/assignments/my");
}

export function listAllLicenseAssignments(): Promise<LicenseAssignment[]> {
  return apiRequest<LicenseAssignment[]>("/assets/licenses/assignments/all");
}
