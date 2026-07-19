import type { Response } from "express";
import type { AppError } from "./app-error";

/**
 * Writes the canonical error envelope (appendix 17 §4) to `res`. Shared by
 * AllExceptionsFilter (for errors thrown inside Nest-managed controllers,
 * guards, interceptors, pipes) and RequestContextMiddleware (for errors
 * thrown in raw Express middleware, which run outside Nest's exception-filter
 * boundary and would otherwise fall through to Express's default handler).
 */
export function renderAppError(res: Response, error: AppError, correlationId: string): void {
  res.status(error.httpStatus).json({
    error: {
      errorRef: error.errorRef,
      code: error.code,
      category: error.category,
      severity: error.severity,
      httpStatus: error.httpStatus,
      message: error.message,
      userAction: error.userAction,
      retryable: error.retryable,
      tenantSafe: error.tenantSafe,
      correlationId,
      objectRef: error.objectRef,
      fieldErrors: error.fieldErrors,
      details: error.details,
    },
  });
}
