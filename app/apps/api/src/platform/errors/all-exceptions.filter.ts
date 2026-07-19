import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";
import { RequestContextService } from "../context/request-context.service";
import { AppError } from "./app-error";
import { renderAppError } from "./render-error";

/**
 * Renders every thrown error as the canonical envelope from
 * docs/07-appendices/17-error-payload-schema-and-recovery-patterns.md §4.
 * AppError subclasses map directly; anything else (framework HttpException,
 * or a truly unhandled bug) is normalized so the response shape never leaks
 * stack traces or internals to the caller — full detail goes to the log only.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("AllExceptionsFilter");

  constructor(private readonly requestContext: RequestContextService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const correlationId = this.requestContext.correlationId;

    const appError = this.normalize(exception, correlationId);

    if (appError.severity === "critical" || appError.httpStatus >= 500) {
      this.logger.error(
        `[${correlationId}] ${appError.code} ${appError.message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    renderAppError(response, appError, correlationId);
  }

  private normalize(exception: unknown, correlationId: string): AppError {
    if (exception instanceof AppError) {
      return exception;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return new AppError({
        errorRef: "ERR-HTTP-001",
        code: `HTTP-${status}`,
        category: status === 401 ? "authentication" : status === 403 ? "authorization" : "validation",
        severity: status >= 500 ? "critical" : "medium",
        httpStatus: status,
        message: exception.message,
        retryable: status >= 500,
        tenantSafe: true,
      });
    }

    return new AppError({
      errorRef: "ERR-UNHANDLED-001",
      code: "PLATFORM-001",
      category: "transient-platform",
      severity: "critical",
      httpStatus: 500,
      message: "Something went wrong. Our team has been notified.",
      userAction: "Retry later or contact support with the correlation ID.",
      retryable: true,
      tenantSafe: false,
      details: { correlationId },
    });
  }
}
