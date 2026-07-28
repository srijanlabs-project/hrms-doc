-- CreateTable
CREATE TABLE "career_plans" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "target_designation_id" UUID,
    "timeframe_years" INTEGER,
    "development_notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "career_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_plan_actions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NotStarted',
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_plan_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "career_plans_tenant_id_idx" ON "career_plans"("tenant_id");

-- CreateIndex
CREATE INDEX "career_plans_tenant_id_employee_id_idx" ON "career_plans"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "career_plan_actions_tenant_id_idx" ON "career_plan_actions"("tenant_id");

-- CreateIndex
CREATE INDEX "career_plan_actions_tenant_id_plan_id_idx" ON "career_plan_actions"("tenant_id", "plan_id");

-- AddForeignKey
ALTER TABLE "career_plans" ADD CONSTRAINT "career_plans_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_plans" ADD CONSTRAINT "career_plans_target_designation_id_fkey" FOREIGN KEY ("target_designation_id") REFERENCES "designations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_plans" ADD CONSTRAINT "career_plans_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_plan_actions" ADD CONSTRAINT "career_plan_actions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_plan_actions" ADD CONSTRAINT "career_plan_actions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "career_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row-Level Security
ALTER TABLE "career_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "career_plans" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "career_plans";
CREATE POLICY tenant_isolation ON "career_plans"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "career_plan_actions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "career_plan_actions" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "career_plan_actions";
CREATE POLICY tenant_isolation ON "career_plan_actions"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
