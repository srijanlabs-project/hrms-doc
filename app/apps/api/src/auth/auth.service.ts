import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError } from "../platform/errors/errors";
import { AuthRepository } from "./auth.repository";
import { SESSION_TTL_MS } from "./constants";
import type { LoginDto } from "./dto/login.dto";
import type { JwtPayload } from "./jwt-payload";

export interface LoginResult {
  token: string;
  expiresAt: Date;
  user: { id: string; email: string; roles: string[] };
}

/** Generic message for every login failure mode, per 01-authentication.md §4: never help enumerate accounts. */
const INVALID_CREDENTIALS_MESSAGE = "Invalid workspace, email, or password.";

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly requestContext: RequestContextService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
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

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new AuthenticationAppError(correlationId, INVALID_CREDENTIALS_MESSAGE);
    }

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
