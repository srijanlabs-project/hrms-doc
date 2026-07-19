-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;

-- CreateTable
CREATE TABLE "otp_challenges" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "code_hash" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'email',
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "consumed_at" TIMESTAMPTZ(6),
    "attempt_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otp_challenges_tenant_id_idx" ON "otp_challenges"("tenant_id");

-- CreateIndex
CREATE INDEX "otp_challenges_user_id_idx" ON "otp_challenges"("user_id");

-- AddForeignKey
ALTER TABLE "otp_challenges" ADD CONSTRAINT "otp_challenges_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_challenges" ADD CONSTRAINT "otp_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table (FORCE + NULLIF; see
-- migration 20260719190000_fix_tenant_isolation_empty_guc for why NULLIF is
-- required). OTP challenges are only ever read/written pre-session, scoped
-- by the tenant resolved from the request body's tenantCode -- never from a
-- client header -- exactly like the login path did before this migration.

ALTER TABLE "otp_challenges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "otp_challenges" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "otp_challenges"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
