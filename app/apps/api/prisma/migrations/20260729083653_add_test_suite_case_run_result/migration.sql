-- CreateTable
CREATE TABLE "test_suites" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "suite_type" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "test_suites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_cases" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "suite_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "expected_result" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_runs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "suite_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "executed_by_user_id" UUID NOT NULL,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "signoff_decision" TEXT,
    "signoff_notes" TEXT,
    "signed_off_by_user_id" UUID,
    "signed_off_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "run_id" UUID NOT NULL,
    "case_id" UUID NOT NULL,
    "outcome" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "recorded_at" TIMESTAMPTZ(6),

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "test_suites_tenant_id_idx" ON "test_suites"("tenant_id");

-- CreateIndex
CREATE INDEX "test_cases_tenant_id_idx" ON "test_cases"("tenant_id");

-- CreateIndex
CREATE INDEX "test_cases_tenant_id_suite_id_idx" ON "test_cases"("tenant_id", "suite_id");

-- CreateIndex
CREATE INDEX "test_runs_tenant_id_idx" ON "test_runs"("tenant_id");

-- CreateIndex
CREATE INDEX "test_runs_tenant_id_suite_id_idx" ON "test_runs"("tenant_id", "suite_id");

-- CreateIndex
CREATE INDEX "test_results_tenant_id_idx" ON "test_results"("tenant_id");

-- CreateIndex
CREATE INDEX "test_results_tenant_id_run_id_idx" ON "test_results"("tenant_id", "run_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_results_run_id_case_id_key" ON "test_results"("run_id", "case_id");

-- AddForeignKey
ALTER TABLE "test_suites" ADD CONSTRAINT "test_suites_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_suite_id_fkey" FOREIGN KEY ("suite_id") REFERENCES "test_suites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_suite_id_fkey" FOREIGN KEY ("suite_id") REFERENCES "test_suites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_runs" ADD CONSTRAINT "test_runs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "test_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "test_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "test_suites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "test_suites" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "test_suites";
CREATE POLICY tenant_isolation ON "test_suites"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "test_cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "test_cases" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "test_cases";
CREATE POLICY tenant_isolation ON "test_cases"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "test_runs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "test_runs" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "test_runs";
CREATE POLICY tenant_isolation ON "test_runs"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "test_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "test_results" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "test_results";
CREATE POLICY tenant_isolation ON "test_results"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
