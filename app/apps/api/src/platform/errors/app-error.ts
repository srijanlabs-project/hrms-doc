/**
 * Error taxonomy per docs/07-appendices/17-error-payload-schema-and-recovery-patterns.md.
 * Categories and severities are the closed vocabularies from that document
 * (section 5 and 6) — do not invent new values without updating the spec.
 */
export type ErrorCategory =
  | "authorization"
  | "authentication"
  | "tenant-boundary"
  | "validation"
  | "business-rule"
  | "state-conflict"
  | "dependency-failure"
  | "rate-limit"
  | "transient-platform"
  | "integration-contract"
  | "integration-delivery";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface FieldError {
  field: string;
  code: string;
  message: string;
}

export interface AppErrorOptions {
  errorRef: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  httpStatus: number;
  message: string;
  userAction?: string;
  retryable: boolean;
  tenantSafe: boolean;
  objectRef?: string;
  fieldErrors?: FieldError[];
  details?: Record<string, unknown>;
}

/** Base of every domain error. Caught by AllExceptionsFilter and rendered as the canonical envelope. */
export class AppError extends Error implements AppErrorOptions {
  errorRef: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  httpStatus: number;
  userAction?: string;
  retryable: boolean;
  tenantSafe: boolean;
  objectRef?: string;
  fieldErrors?: FieldError[];
  details?: Record<string, unknown>;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.errorRef = options.errorRef;
    this.code = options.code;
    this.category = options.category;
    this.severity = options.severity;
    this.httpStatus = options.httpStatus;
    this.userAction = options.userAction;
    this.retryable = options.retryable;
    this.tenantSafe = options.tenantSafe;
    this.objectRef = options.objectRef;
    this.fieldErrors = options.fieldErrors;
    this.details = options.details;
  }
}
