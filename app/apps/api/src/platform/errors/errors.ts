import { AppError, type FieldError } from "./app-error";

/** Unknown or missing X-Tenant-Code, or a resolved tenant outside the caller's grant. */
export class TenantBoundaryError extends AppError {
  constructor(correlationId: string) {
    super({
      errorRef: "ERR-TENANT-001",
      code: "TENANT-001",
      category: "tenant-boundary",
      severity: "critical",
      httpStatus: 403,
      // Generic wording per appendix 17 §9: never confirm or deny a foreign tenant's existence.
      message: "This request could not be resolved to an accessible tenant.",
      userAction: "Verify the tenant context and try again, or contact your administrator.",
      retryable: false,
      tenantSafe: true,
      details: { correlationId },
    });
  }
}

/** DTO validation failures, raised from the global ValidationPipe exception factory. */
export class ValidationAppError extends AppError {
  constructor(fieldErrors: FieldError[]) {
    super({
      errorRef: "ERR-VALIDATION-001",
      code: "VALIDATION-001",
      category: "validation",
      severity: "medium",
      httpStatus: 422,
      message: "One or more fields are invalid.",
      userAction: "Correct the highlighted fields and resubmit.",
      retryable: false,
      tenantSafe: true,
      fieldErrors,
    });
  }
}

/** A tenant-scoped resource was not found within the caller's own tenant. */
export class NotFoundAppError extends AppError {
  constructor(objectRef: string, message = "The requested item could not be found.") {
    super({
      errorRef: "ERR-NOTFOUND-001",
      code: "NOTFOUND-001",
      // No dedicated "not-found" category exists in appendix 17 section 5;
      // business-rule is the closest documented fit for "prerequisite record
      // does not exist" outside the tenant-boundary case.
      category: "business-rule",
      severity: "low",
      httpStatus: 404,
      message,
      retryable: false,
      tenantSafe: true,
      objectRef,
    });
  }
}
