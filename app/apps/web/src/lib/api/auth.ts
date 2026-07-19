import { apiRequest } from "./http";

export interface SessionUser {
  id: string;
  email: string;
  roles: string[];
  employeeId: string | null;
  displayName: string;
}

export interface RequestOtpInput {
  tenantCode: string;
  email: string;
}

export interface VerifyOtpInput {
  tenantCode: string;
  email: string;
  otp: string;
}

/** `devOtp` is only present outside production — see AuthService.requestOtp. */
export function requestOtp(input: RequestOtpInput): Promise<{ sent: true; devOtp?: string }> {
  return apiRequest("/auth/otp/request", { method: "POST", body: JSON.stringify(input) });
}

export function verifyOtp(input: VerifyOtpInput): Promise<{ user: SessionUser; expiresAt: string }> {
  return apiRequest("/auth/otp/verify", { method: "POST", body: JSON.stringify(input) });
}

export function logout(): Promise<{ loggedOut: boolean }> {
  return apiRequest("/auth/logout", { method: "POST" });
}

export function getCurrentSession(): Promise<SessionUser> {
  return apiRequest<SessionUser>("/auth/session/current");
}
