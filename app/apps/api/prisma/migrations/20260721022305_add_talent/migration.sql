-- CreateTable
CREATE TABLE "talent_assessments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "period_year" INTEGER NOT NULL,
    "performance_rating" INTEGER NOT NULL,
    "potential_rating" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "talent_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "talent_assessments_tenant_id_idx" ON "talent_assessments"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "talent_assessments_tenant_id_employee_id_period_year_key" ON "talent_assessments"("tenant_id", "employee_id", "period_year");

-- AddForeignKey
ALTER TABLE "talent_assessments" ADD CONSTRAINT "talent_assessments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_assessments" ADD CONSTRAINT "talent_assessments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table: FORCE + NULLIF(...) so a
-- connection with no app.tenant_id set fails closed to zero rows (see
-- migration 20260719190000_fix_tenant_isolation_empty_guc).

ALTER TABLE "talent_assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "talent_assessments" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "talent_assessments"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
