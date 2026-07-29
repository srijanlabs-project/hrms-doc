-- AlterTable
ALTER TABLE "go_live_checklist_items" ADD COLUMN     "phase" TEXT NOT NULL DEFAULT 'Setup';

-- AlterTable
ALTER TABLE "personal_details" ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "medical_conditions" TEXT,
ADD COLUMN     "physician_name" TEXT,
ADD COLUMN     "physician_phone" TEXT;

-- CreateTable
CREATE TABLE "department_budgets" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "period_year" INTEGER NOT NULL,
    "allocated_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "department_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "department_budgets_tenant_id_idx" ON "department_budgets"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_budgets_tenant_id_department_id_period_year_key" ON "department_budgets"("tenant_id", "department_id", "period_year");

-- AddForeignKey
ALTER TABLE "department_budgets" ADD CONSTRAINT "department_budgets_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_budgets" ADD CONSTRAINT "department_budgets_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "department_budgets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "department_budgets" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "department_budgets";
CREATE POLICY tenant_isolation ON "department_budgets"
  USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
