import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError } from "../platform/errors/errors";
import { AuthRepository } from "./auth.repository";
import { OTP_MAX_ATTEMPTS, OTP_TTL_MS, SESSION_TTL_MS } from "./constants";
import type { RequestOtpDto } from "./dto/request-otp.dto";
import type { VerifyOtpDto } from "./dto/verify-otp.dto";
import type { JwtPayload } from "./jwt-payload";
import { OTP_PROVIDER, type OtpProvider } from "./otp/otp-provider";

export interface LoginResult {
  token: string;
  expiresAt: Date;
  user: { id: string; email: string; roles: string[] };
}

/** Generic message for every login failure mode, per 01-authentication.md §4: never help enumerate accounts. */
const INVALID_CREDENTIALS_MESSAGE = "Invalid workspace, email, or code.";

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly requestContext: RequestContextService,
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
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<LoginResult> {
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

    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    const session = await this.repository.createSession(tenant.id, user.id, expiresAt);

    const payload: JwtPayload = { sub: user.id, tenantId: tenant.id, sid: session.id, roles: user.roles };
    const token = this.jwtService.sign(payload, { expiresIn: Math.floor(SESSION_TTL_MS / 1000) });

    return { token, expiresAt, user: { id: user.id, email: user.email, roles: user.roles } };
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
    };
  }

  private requireAuthenticated(): { tenantId: string; userId: string; sessionId: string } {
    const { tenantId, userId, sessionId } = this.requestContext.store ?? {};
    if (!tenantId || !userId || !sessionId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId, sessionId };
  }
}
