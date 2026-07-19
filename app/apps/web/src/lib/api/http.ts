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
 *
 * Tenant identity now comes from the httpOnly session cookie (Phase 3
 * AuthGuard), not a client-supplied header — a client can no longer claim a
 * tenant it doesn't have a session for. `credentials: "include"` is set
 * explicitly so cookies are sent even if the API is ever served from a
 * different origin than the Vite dev proxy's same-origin default.
 */
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/v1${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new ApiError((body as { error: ApiErrorPayload }).error);
  }

  return (body as { data: T }).data;
}
