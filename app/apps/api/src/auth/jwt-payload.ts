export interface JwtPayload {
  sub: string;
  tenantId: string;
  sid: string;
  roles: string[];
}

/** Signed after email-OTP succeeds for an MFA-enrolled account; redeemable only via POST /auth/mfa/challenge. */
export interface MfaPendingPayload {
  sub: string;
  tenantId: string;
  purpose: "mfa-pending";
}
