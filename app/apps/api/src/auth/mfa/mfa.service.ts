import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { MfaRepository } from "./mfa.repository";

function stateConflict(message: string) {
  return new AppError({
    errorRef: "ERR-MFA-001",
    code: "MFA-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-MFA-FACTOR",
  });
}

/**
 * MFA engine (Identity and Access, 03-mfa.md) — v1 slice: authenticator-app
 * (TOTP) factor only, one factor per user, no adaptive/step-up triggering,
 * no break-glass bypass. Real login-time effect lives in AuthService, which
 * calls findActiveFactorForUser()/verifyCode() below.
 */
@Injectable()
export class MfaService {
  constructor(
    private readonly repository: MfaRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async enroll(email: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const active = await this.repository.findActiveForUser(tenantId, userId);
    if (active) {
      throw stateConflict("MFA is already active for this account. Revoke it first to re-enroll.");
    }
    const pending = await this.repository.findPendingForUser(tenantId, userId);
    if (pending) {
      await this.repository.deletePending(tenantId, pending.id);
    }
    const secretBase32 = authenticator.generateSecret();
    const factor = await this.repository.create(tenantId, userId, secretBase32);
    return {
      factorId: factor.id,
      secret: secretBase32,
      otpauthUri: authenticator.keyuri(email, "Staffsy", secretBase32),
    };
  }

  async confirmEnrollment(code: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const pending = await this.repository.findPendingForUser(tenantId, userId);
    if (!pending) {
      throw new NotFoundAppError("OBJ-MFA-FACTOR", "No pending MFA enrollment found. Start enrollment again.");
    }
    if (!authenticator.verify({ token: code, secret: pending.secretBase32 })) {
      throw stateConflict("That code didn't match. Check your authenticator app and try again.");
    }
    return this.repository.activate(tenantId, pending.id);
  }

  async listFactors() {
    const { tenantId, userId } = this.requireAuthenticated();
    const factors = await this.repository.findAllForUser(tenantId, userId);
    return factors.map((f) => ({ id: f.id, type: f.type, status: f.status, createdAt: f.createdAt, verifiedAt: f.verifiedAt }));
  }

  async revoke(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const factor = await this.repository.findById(tenantId, id);
    if (!factor || factor.userId !== userId) {
      throw new NotFoundAppError("OBJ-MFA-FACTOR", "MFA factor not found.");
    }
    return this.repository.revoke(tenantId, id);
  }

  /** Called by AuthService during login — not authenticated-request-scoped, so it takes tenantId/userId directly. */
  findActiveFactorForUser(tenantId: string, userId: string) {
    return this.repository.findActiveForUser(tenantId, userId);
  }

  verifyCode(secretBase32: string, code: string): boolean {
    return authenticator.verify({ token: code, secret: secretBase32 });
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
