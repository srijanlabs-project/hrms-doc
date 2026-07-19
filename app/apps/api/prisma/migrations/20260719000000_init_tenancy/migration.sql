-- Phase 1: tenancy foundation.
-- Creates the platform-plane tenants table and the first tenant-plane table
-- (legal_entities) with Row Level Security enforced per docs/07-appendices/29.
--
-- RLS pattern used throughout the codebase:
--   1. ENABLE ROW LEVEL SECURITY  -> RLS applies to ordinary users
--   2. FORCE ROW LEVEL SECURITY   -> RLS applies even to the table owner
--      (the app connects as the owning role `staffsy`, so FORCE is required
--      or the policy would be silently bypassed)
--   3. a single tenant_isolation policy scopes every row to
--      current_setting('app.tenant_id') for USING and WITH CHECK
--
-- The app sets app.tenant_id per-transaction via set_config(), never as a
-- session-wide GUC, so pooled connections cannot leak tenant context between
-- requests. See apps/api/src/platform/prisma/prisma.service.ts.

-- Platform plane: no RLS. Only platform admin code paths touch this table
-- directly; tenant-scoped code never queries it without going through the
-- tenant-context middleware first.
CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenants_code_key" ON "tenants"("code");

-- Tenant plane: RLS enforced.
CREATE TABLE "legal_entities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'IN',
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "legal_entities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "legal_entities_tenant_id_code_key" ON "legal_entities"("tenant_id", "code");
CREATE INDEX "legal_entities_tenant_id_idx" ON "legal_entities"("tenant_id");

ALTER TABLE "legal_entities" ADD CONSTRAINT "legal_entities_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Row Level Security --------------------------------------------------------

ALTER TABLE "legal_entities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "legal_entities" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "legal_entities"
    USING ("tenant_id" = current_setting('app.tenant_id', true)::uuid)
    WITH CHECK ("tenant_id" = current_setting('app.tenant_id', true)::uuid);

-- When app.tenant_id is unset, current_setting(..., true) returns NULL, and
-- "tenant_id" = NULL is never true for any row -- so a connection with no
-- tenant context set sees zero rows rather than erroring or leaking data.
