import { apiRequest } from "./http";

export const ASSIGNABLE_ROLES = ["employee", "manager", "hr_ops", "org_admin"] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export const ROLE_LABELS: Record<AssignableRole, string> = {
  employee: "Employee",
  manager: "Manager",
  hr_ops: "HR",
  org_admin: "Company Org Admin",
};

export interface EmployeeAccessRow {
  employeeId: string;
  employeeCode: string;
  legalName: string;
  personalEmail: string | null;
  status: string;
  departmentName: string | null;
  user: { id: string; email: string; roles: string[]; status: string } | null;
}

export type ProvisionSkipReason = "AlreadyHasLogin" | "NoPersonalEmail" | "EmailAlreadyUsed" | "NotActive";

export const SKIP_REASON_LABELS: Record<ProvisionSkipReason, string> = {
  AlreadyHasLogin: "Already has a login",
  NoPersonalEmail: "No email on the employee record",
  EmailAlreadyUsed: "That email already signs in as someone else",
  NotActive: "Employee has exited",
};

export interface ProvisionResult {
  employeeId: string;
  employeeCode: string;
  legalName: string;
  created: boolean;
  email?: string;
  skipReason?: ProvisionSkipReason;
}

export function listUserAccess(): Promise<EmployeeAccessRow[]> {
  return apiRequest("/people/user-access");
}

/** Creates logins for every employee that doesn't have one. Idempotent — safe to re-run after fixing the rows it skipped. */
export function provisionMissingLogins(roles?: AssignableRole[]): Promise<{
  created: number;
  skipped: number;
  results: ProvisionResult[];
}> {
  return apiRequest("/people/user-access/provision-missing", { method: "POST", body: JSON.stringify({ roles }) });
}

export function provisionLogin(employeeId: string, roles?: AssignableRole[]): Promise<ProvisionResult> {
  return apiRequest(`/people/user-access/employees/${employeeId}`, {
    method: "POST",
    body: JSON.stringify({ roles }),
  });
}

export function updateUserRoles(userId: string, roles: AssignableRole[]): Promise<{ id: string; roles: string[] }> {
  return apiRequest(`/people/user-access/users/${userId}/roles`, {
    method: "PATCH",
    body: JSON.stringify({ roles }),
  });
}
