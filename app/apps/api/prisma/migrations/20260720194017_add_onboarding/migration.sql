-- CreateTable
CREATE TABLE "onboarding_cases" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'InProgress',
    "activated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "onboarding_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_tasks" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "is_blocking" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'NotStarted',
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "onboarding_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_cases_employee_id_key" ON "onboarding_cases"("employee_id");

-- CreateIndex
CREATE INDEX "onboarding_cases_tenant_id_idx" ON "onboarding_cases"("tenant_id");

-- CreateIndex
CREATE INDEX "onboarding_tasks_tenant_id_idx" ON "onboarding_tasks"("tenant_id");

-- CreateIndex
CREATE INDEX "onboarding_tasks_tenant_id_case_id_idx" ON "onboarding_tasks"("tenant_id", "case_id");

-- AddForeignKey
ALTER TABLE "onboarding_cases" ADD CONSTRAINT "onboarding_cases_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_cases" ADD CONSTRAINT "onboarding_cases_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_tasks" ADD CONSTRAINT "onboarding_tasks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_tasks" ADD CONSTRAINT "onboarding_tasks_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "onboarding_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table: FORCE + NULLIF(...) so a
-- connection with no app.tenant_id set fails closed to zero rows (see
-- migration 20260719190000_fix_tenant_isolation_empty_guc).

ALTER TABLE "onboarding_cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "onboarding_cases" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "onboarding_cases"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "onboarding_tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "onboarding_tasks" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "onboarding_tasks"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
