import { AsyncLocalStorage } from "node:async_hooks";
import { Injectable } from "@nestjs/common";

export interface RequestContextStore {
  correlationId: string;
  /**
   * Set two ways: RequestContextMiddleware resolves a "claimed" tenant from
   * the X-Tenant-Code header (needed pre-auth, e.g. for /auth/login itself).
   * AuthGuard then overwrites tenantId/userId/roles with the verified values
   * from the caller's session for every protected route, via
   * setAuthenticated() below — so a client-supplied header can never widen
   * a request's actual tenant scope once a session exists.
   */
  tenantId?: string;
  tenantCode?: string;
  userId?: string;
  sessionId?: string;
  roles?: string[];
}

/**
 * Per-request context propagated via AsyncLocalStorage so deep service and
 * repository code can read it without threading the request object through
 * every call. Set once per request by RequestContextMiddleware.
 */
@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextStore>();

  run<T>(store: RequestContextStore, callback: () => T): T {
    return this.storage.run(store, callback);
  }

  get store(): RequestContextStore | undefined {
    return this.storage.getStore();
  }

  get correlationId(): string {
    return this.store?.correlationId ?? "no-correlation-id";
  }

  get tenantId(): string | undefined {
    return this.store?.tenantId;
  }

  get userId(): string | undefined {
    return this.store?.userId;
  }

  get roles(): string[] {
    return this.store?.roles ?? [];
  }

  /** Called once by AuthGuard after verifying a session; mutates the live store in place. */
  setAuthenticated(auth: { tenantId: string; userId: string; sessionId: string; roles: string[] }): void {
    const store = this.storage.getStore();
    if (!store) return;
    store.tenantId = auth.tenantId;
    store.userId = auth.userId;
    store.sessionId = auth.sessionId;
    store.roles = auth.roles;
  }
}
