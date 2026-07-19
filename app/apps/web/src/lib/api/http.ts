import { CURRENT_TENANT_CODE } from "../tenant";

/** Mirrors the canonical envelope in docs/07-appendices/17-error-payload-schema-and-recovery-patterns.md. */
export interface ApiErrorPayload {
  errorRef: string;
  code: string;
  category: string;
  severity: string;
  httpStatus: number;
  message: string;
  userAction?: string;
  retryable: boolean;
  tenantSafe: boolean;
  correlationId: string;
  objectRef?: string;
  fieldErrors?: { field: string; code: string; message: string }[];
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(public readonly payload: ApiErrorPayload) {
    super(payload.message);
  }
}

/**
 * Hand-written typed fetch client. Fast-follow per the tech-stack ADR
 * (docs/06-cross-cutting-specs/19): once OpenAPI YAML is authored for the
 * org and people services, this becomes a generated client instead.
 */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Code": CURRENT_TENANT_CODE,
      ...init?.headers,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new ApiError((body as { error: ApiErrorPayload }).error);
  }

  return (body as { data: T }).data;
}
