/**
 * Placeholder until Phase 3 (Identity & Access) wires real session-derived
 * tenant context. Every API call sends this as X-Tenant-Code so the org and
 * people modules built in Phase 2 have something real to scope against.
 */
export const CURRENT_TENANT_CODE = "acme";
