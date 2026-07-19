import { AsyncLocalStorage } from "node:async_hooks";
import { Injectable } from "@nestjs/common";

export interface RequestContextStore {
  correlationId: string;
  tenantId?: string;
  tenantCode?: string;
}

/**
 * Per-request context (tenant + correlation id) propagated via
 * AsyncLocalStorage so deep service and repository code can read it without
 * threading the request object through every call. Set once per request by
 * RequestContextMiddleware.
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
}
