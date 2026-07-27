import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RequestContextService } from "../context/request-context.service";
import { ForbiddenAppError } from "../errors/errors";

const HEADER_NAME = "x-platform-key";

/**
 * Gates tenant provisioning — an operation that by definition happens
 * before any tenant session exists, so it can't be protected by the normal
 * AuthGuard/RolesGuard (those require a resolved tenant). A shared secret
 * (PLATFORM_PROVISIONING_KEY) stands in for a real platform-admin identity
 * system, which this build has no other use for — same "swap-in behind one
 * seam" discipline as StaticDevOtpProvider/StaticDevAiProvider, just a
 * guard instead of a provider interface.
 */
@Injectable()
export class PlatformKeyGuard implements CanActivate {
  constructor(private readonly requestContext: RequestContextService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const provided = req.header(HEADER_NAME);
    const expected = process.env.PLATFORM_PROVISIONING_KEY ?? "dev-only-platform-key-change-me";

    if (!provided || provided !== expected) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return true;
  }
}
