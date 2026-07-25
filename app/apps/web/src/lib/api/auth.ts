import { apiRequest } from "./http";

export interface SessionUser {
  id: string;
  email: string;
  roles: string[];
  employeeId: string | null;
  displayName: string;
  /** "Separated"/"Archived" routes the app shell to the limited exit portal instead of the normal shell. */
  employeeStatus: string | null;
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

export interface LoginResult {
  user: SessionUser;
  expiresAt: string;
}

export interface MfaPendingResult {
  mfaRequired: true;
  pendingToken: string;
}

/** `devOtp` is only present outside production — see AuthService.requestOtp. */
export function requestOtp(input: RequestOtpInput): Promise<{ sent: true; devOtp?: string }> {
  return apiRequest("/auth/otp/request", { method: "POST", body: JSON.stringify(input) });
}

/** Returns a real login result, or — for an MFA-enrolled account — a pendingToken that completeMfaChallenge() must redeem. */
export function verifyOtp(input: VerifyOtpInput): Promise<LoginResult | MfaPendingResult> {
  return apiRequest("/auth/otp/verify", { method: "POST", body: JSON.stringify(input) });
}

export function completeMfaChallenge(pendingToken: string, code: string): Promise<LoginResult> {
  return apiRequest("/auth/mfa/challenge", { method: "POST", body: JSON.stringify({ pendingToken, code }) });
}

export function logout(): Promise<{ loggedOut: boolean }> {
  return apiRequest("/auth/logout", { method: "POST" });
}

export function getCurrentSession(): Promise<SessionUser> {
  return apiRequest<SessionUser>("/auth/session/current");
}
