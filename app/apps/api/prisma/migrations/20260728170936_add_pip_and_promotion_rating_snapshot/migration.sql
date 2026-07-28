-- AlterTable
ALTER TABLE "transfer_promotion_requests" ADD COLUMN     "latest_appraisal_period_year" INTEGER,
ADD COLUMN     "latest_appraisal_rating" INTEGER;

-- CreateTable
CREATE TABLE "performance_improvement_plans" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "outcome_notes" TEXT,
    "created_by_user_id" UUID NOT NULL,
    "closed_by_user_id" UUID,
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "performance_improvement_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pip_objectives" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "pip_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "target_date" DATE,
    "status" TEXT NOT NULL DEFAULT 'NotStarted',
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pip_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "performance_improvement_plans_tenant_id_idx" ON "performance_improvement_plans"("tenant_id");

-- CreateIndex
CREATE INDEX "performance_improvement_plans_tenant_id_employee_id_idx" ON "performance_improvement_plans"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "pip_objectives_tenant_id_idx" ON "pip_objectives"("tenant_id");

-- CreateIndex
CREATE INDEX "pip_objectives_tenant_id_pip_id_idx" ON "pip_objectives"("tenant_id", "pip_id");

-- AddForeignKey
ALTER TABLE "performance_improvement_plans" ADD CONSTRAINT "performance_improvement_plans_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_improvement_plans" ADD CONSTRAINT "performance_improvement_plans_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pip_objectives" ADD CONSTRAINT "pip_objectives_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pip_objectives" ADD CONSTRAINT "pip_objectives_pip_id_fkey" FOREIGN KEY ("pip_id") REFERENCES "performance_improvement_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row-Level Security
ALTER TABLE "performance_improvement_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "performance_improvement_plans" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "performance_improvement_plans";
CREATE POLICY tenant_isolation ON "performance_improvement_plans"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "pip_objectives" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pip_objectives" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "pip_objectives";
CREATE POLICY tenant_isolation ON "pip_objectives"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
