import { randomUUID } from "node:crypto";
import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { TenantBoundaryError } from "../errors/errors";
import { renderAppError } from "../errors/render-error";
import { PrismaService } from "../prisma/prisma.service";
import { RequestContextService } from "./request-context.service";

/**
 * Resolves the correlation id and tenant context for every request, per the
 * shared header requirements in docs/07-appendices/28 §5. Runs before all
 * route handlers via AppModule.configure(). Tenant resolution queries the
 * platform-plane `tenants` table directly (no RLS there — see migration
 * comment), so this is the one sanctioned place tenant identity is decided.
 *
 * Errors are rendered directly here rather than thrown: this middleware runs
 * as raw Express middleware, outside the boundary Nest's exception filters
 * cover, so a thrown error from an async `use()` would otherwise be an
 * unhandled rejection instead of a clean response.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(
    private readonly requestContext: RequestContextService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      (req.header("X-Correlation-Id") as string | undefined) ?? randomUUID();
    res.setHeader("X-Correlation-Id", correlationId);

    const tenantCode = req.header("X-Tenant-Code") as string | undefined;
    let tenantId: string | undefined;

    if (tenantCode) {
      try {
        const tenant = await this.prisma.tenant.findUnique({ where: { code: tenantCode } });
        if (!tenant || tenant.status !== "active") {
          renderAppError(res, new TenantBoundaryError(correlationId), correlationId);
          return;
        }
        tenantId = tenant.id;
      } catch (_err) {
        const fallback = new AppError({
          errorRef: "ERR-UNHANDLED-001",
          code: "PLATFORM-001",
          category: "transient-platform",
          severity: "critical",
          httpStatus: 503,
          message: "Tenant resolution is temporarily unavailable.",
          retryable: true,
          tenantSafe: false,
          details: { correlationId },
        });
        renderAppError(res, fallback, correlationId);
        return;
      }
    }

    this.requestContext.run({ correlationId, tenantId, tenantCode }, () => next());
  }
}
