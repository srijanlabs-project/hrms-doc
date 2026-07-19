import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import { AuthRepository } from "../auth.repository";
import { SESSION_COOKIE_NAME } from "../constants";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import type { JwtPayload } from "../jwt-payload";

const SIGN_IN_MESSAGE = "Sign in to continue.";

/**
 * Global guard (registered in AppModule). Verifies the session cookie's JWT
 * signature and expiry, then confirms the session hasn't been revoked in the
 * database, then overwrites the request context's tenantId/userId/roles
 * with these verified values — closing the gap where Phase 1/2 trusted a
 * client-supplied X-Tenant-Code header for every request.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const correlationId = this.requestContext.correlationId;
    const token = (req.cookies as Record<string, string> | undefined)?.[SESSION_COOKIE_NAME];
    if (!token) {
      throw new AuthenticationAppError(correlationId, SIGN_IN_MESSAGE);
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new AuthenticationAppError(correlationId, SIGN_IN_MESSAGE);
    }

    const session = await this.authRepository.findActiveSession(payload.tenantId, payload.sid, payload.sub);
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new AuthenticationAppError(correlationId, SIGN_IN_MESSAGE);
    }

    this.requestContext.setAuthenticated({
      tenantId: payload.tenantId,
      userId: payload.sub,
      sessionId: payload.sid,
      roles: payload.roles,
    });
    return true;
  }
}
