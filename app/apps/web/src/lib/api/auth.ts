import { apiRequest } from "./http";

export interface SessionUser {
  id: string;
  email: string;
  roles: string[];
  employeeId: string | null;
  displayName: string;
}

export interface LoginInput {
  tenantCode: string;
  email: string;
  password: string;
}

export function login(input: LoginInput): Promise<{ user: SessionUser; expiresAt: string }> {
  return apiRequest("/auth/login", { method: "POST", body: JSON.stringify(input) });
}

export function logout(): Promise<{ loggedOut: boolean }> {
  return apiRequest("/auth/logout", { method: "POST" });
}

export function getCurrentSession(): Promise<SessionUser> {
  return apiRequest<SessionUser>("/auth/session/current");
}
