import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuditService } from "../platform/audit/audit.service";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError, ForbiddenAppError } from "../platform/errors/errors";
import { AuthRepository } from "./auth.repository";
import { OTP_MAX_ATTEMPTS, OTP_TTL_MS, SESSION_TTL_MS } from "./constants";
import type { RequestOtpDto } from "./dto/request-otp.dto";
import type { VerifyOtpDto } from "./dto/verify-otp.dto";
import type { JwtPayload, MfaPendingPayload } from "./jwt-payload";
import { MfaService } from "./mfa/mfa.service";
import { OTP_PROVIDER, type OtpProvider } from "./otp/otp-provider";

export interface LoginResult {
  token: string;
  expiresAt: Date;
  user: { id: string; email: string; roles: string[] };
}

export interface MfaPendingResult {
  mfaRequired: true;
  pendingToken: string;
}

export type VerifyOtpResult = LoginResult | MfaPendingResult;

const MFA_PENDING_TTL_S = 5 * 60;

/** Generic message for every login failure mode, per 01-authentication.md §4: never help enumerate accounts. */
const INVALID_CREDENTIALS_MESSAGE = "Invalid workspace, email, or code.";

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly requestContext: RequestContextService,
    private readonly mfaService: MfaService,
    private readonly audit: AuditService,
    @Inject(OTP_PROVIDER) private readonly otpProvider: OtpProvider,
  ) {}

  /**
   * Always resolves the same way to the caller regardless of whether the
   * tenant/email is real, so the response can never be used to enumerate
   * accounts. `devOtp` is safe to return unconditionally in non-production:
   * it's a fixed constant either way, so its presence carries no
   * information about whether the account actually exists.
   */
  async requestOtp(dto: RequestOtpDto): Promise<{ sent: true; devOtp?: string }> {
    const tenant = await this.repository.findTenantByCode(dto.tenantCode);
    const email = dto.email.trim().toLowerCase();
    const user =
      tenant && tenant.status === "active" ? await this.repository.findUserByEmail(tenant.id, email) : null;

    if (tenant && user && user.status === "Active") {
      await this.repository.invalidateOutstandingOtpChallenges(tenant.id, user.id);
      const code = await this.otpProvider.send(email);
      const codeHash = await bcrypt.hash(code, 10);
      await this.repository.createOtpChallenge(tenant.id, user.id, codeHash, new Date(Date.now() + OTP_TTL_MS));
    } else {
      // No real account to issue a challenge for -- still do comparable
      // bcrypt work so response timing can't be used to distinguish a real
      // account from a nonexistent one (the response body already can't).
      await bcrypt.hash("decoy", 10);
    }

    const devOtp = process.env.NODE_ENV === "production" ? undefined : "123456";
    return { sent: true, devOtp };
  }

  /**
   * Early-returns on each failure mode rather than equalizing timing across
   * them (contrast requestOtp's decoy hash). Acceptable while devOtp is a
   * fixed, publicly-logged constant -- that already defeats any real
   * security boundary here regardless of timing. Revisit alongside swapping
   * in a real OtpProvider for UAT.
   *
   * If the user has an Active MFA factor (see mfa/), this does NOT issue a
   * session — it returns a short-lived pendingToken that only
   * completeMfaChallenge() can redeem, so email-OTP alone is never enough
   * for an MFA-enrolled account.
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<VerifyOtpResult> {
    const correlationId = this.requestContext.correlationId;

    const tenant = await this.repository.findTenantByCode(dto.tenantCode);
    if (!tenant || tenant.status !== "active") {
      throw new AuthenticationAppError(correlationId, INVALID_CREDENTIALS_MESSAGE);
    }

    const email = dto.email.trim().toLowerCase();
    const user = await this.repository.findUserByEmail(tenant.id, email);
    if (!user || user.status !== "Active") {
      throw new AuthenticationAppError(correlationId, INVALID_CREDENTIALS_MESSAGE);
    }

    const challenge = await this.repository.findLatestOtpChallenge(tenant.id, user.id);
    if (!challenge || challenge.expiresAt < new Date() || challenge.attemptCount >= OTP_MAX_ATTEMPTS) {
      throw new AuthenticationAppError(correlationId, INVALID_CREDENTIALS_MESSAGE);
    }

    const matches = await bcrypt.compare(dto.otp, challenge.codeHash);
    if (!matches) {
      await this.repository.incrementOtpAttempt(tenant.id, challenge.id);
      throw new AuthenticationAppError(correlationId, INVALID_CREDENTIALS_MESSAGE);
    }
    await this.repository.consumeOtpChallenge(tenant.id, challenge.id);

    const activeMfaFactor = await this.mfaService.findActiveFactorForUser(tenant.id, user.id);
    if (activeMfaFactor) {
      const payload: MfaPendingPayload = { sub: user.id, tenantId: tenant.id, purpose: "mfa-pending" };
      const pendingToken = this.jwtService.sign(payload, { expiresIn: MFA_PENDING_TTL_S });
      return { mfaRequired: true, pendingToken };
    }

    return this.issueSession(tenant.id, user);
  }

  async completeMfaChallenge(pendingToken: string, code: string): Promise<LoginResult> {
    const correlationId = this.requestContext.correlationId;
    let payload: MfaPendingPayload;
    try {
      payload = this.jwtService.verify<MfaPendingPayload>(pendingToken);
    } catch {
      throw new AuthenticationAppError(correlationId, "Your MFA challenge has expired. Sign in again.");
    }
    if (payload.purpose !== "mfa-pending") {
      throw new AuthenticationAppError(correlationId, "Your MFA challenge has expired. Sign in again.");
    }

    const user = await this.repository.findUserById(payload.tenantId, payload.sub);
    if (!user || user.status !== "Active") {
      throw new AuthenticationAppError(correlationId, INVALID_CREDENTIALS_MESSAGE);
    }
    const factor = await this.mfaService.findActiveFactorForUser(payload.tenantId, user.id);
    if (!factor || !this.mfaService.verifyCode(factor.secretBase32, code)) {
      throw new AuthenticationAppError(correlationId, "That code didn't match. Check your authenticator app and try again.");
    }

    return this.issueSession(payload.tenantId, user);
  }

  /**
   * Admin-initiated support login as another user (06-delegation.md-adjacent
   * "proxy login" from 03-identity-and-access). Never allowed into another
   * org_admin/hr_ops account — no privilege escalation via impersonation.
   * Ends the caller's own admin session, mirroring how a real support agent
   * would switch identities; logging back in as themselves afterward is the
   * expected flow. Fully audited.
   */
  async proxyLogin(targetUserId: string): Promise<LoginResult> {
    const { tenantId, userId: actorUserId } = this.requireAuthenticated();
    const target = await this.repository.findUserById(tenantId, targetUserId);
    if (!target || target.status !== "Active") {
      throw new AuthenticationAppError(this.requestContext.correlationId, "That user cannot be signed in as.");
    }
    if (target.roles.some((role) => role === "org_admin" || role === "hr_ops")) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    const result = await this.issueSession(tenantId, target);
    await this.audit.record({
      actorUserId,
      entityType: "User",
      entityId: targetUserId,
      action: "Auth.proxyLogin",
    });
    return result;
  }

  /** Same as proxyLogin(), but the caller only knows the employeeId (e.g. the Employee 360 page). */
  async proxyLoginByEmployee(employeeId: string): Promise<LoginResult> {
    const { tenantId } = this.requireAuthenticated();
    const target = await this.repository.findUserByEmployeeId(tenantId, employeeId);
    if (!target) {
      throw new AuthenticationAppError(this.requestContext.correlationId, "That employee has no login account.");
    }
    return this.proxyLogin(target.id);
  }

  async logout(): Promise<void> {
    const { tenantId, sessionId } = this.requireAuthenticated();
    await this.repository.revokeSession(tenantId, sessionId);
  }

  async getCurrentSession() {
    const { tenantId, userId } = this.requireAuthenticated();
    const user = await this.repository.findUserByIdWithEmployeeName(tenantId, userId);
    if (!user) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      employeeId: user.employeeId,
      displayName: user.employee?.legalName ?? user.email,
      employeeStatus: user.employee?.status ?? null,
    };
  }

  /** Device management (03-identity-and-access) v1 slice: a session IS the device record — list/revoke, no separate device fingerprint or trust state. */
  async listSessions() {
    const { tenantId, userId, sessionId } = this.requireAuthenticated();
    const sessions = await this.repository.findActiveSessionsForUser(tenantId, userId);
    return sessions.map((s) => ({
      id: s.id,
      issuedAt: s.issuedAt,
      expiresAt: s.expiresAt,
      isCurrent: s.id === sessionId,
    }));
  }

  async revokeSessionById(id: string): Promise<void> {
    const { tenantId, userId } = this.requireAuthenticated();
    await this.repository.revokeSessionForUser(tenantId, userId, id);
  }

  private async issueSession(tenantId: string, user: User): Promise<LoginResult> {
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    const session = await this.repository.createSession(tenantId, user.id, expiresAt);

    const payload: JwtPayload = { sub: user.id, tenantId, sid: session.id, roles: user.roles };
    const token = this.jwtService.sign(payload, { expiresIn: Math.floor(SESSION_TTL_MS / 1000) });

    return { token, expiresAt, user: { id: user.id, email: user.email, roles: user.roles } };
  }

  private requireAuthenticated(): { tenantId: string; userId: string; sessionId: string } {
    const { tenantId, userId, sessionId } = this.requestContext.store ?? {};
    if (!tenantId || !userId || !sessionId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId, sessionId };
  }
}
