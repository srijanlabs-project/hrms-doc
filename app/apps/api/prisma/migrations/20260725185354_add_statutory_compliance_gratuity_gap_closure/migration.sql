-- AlterTable
ALTER TABLE "fnf_cases" ADD COLUMN     "gratuity_amount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "statutory_compliance_settings" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "minimum_wage_threshold" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lwf_employee_contribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lwf_employer_contribution" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lwf_frequency_months" INTEGER NOT NULL DEFAULT 6,
    "bonus_eligibility_ceiling" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonus_percent" DOUBLE PRECISION NOT NULL DEFAULT 8.33,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "statutory_compliance_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statutory_compliance_settings_tenant_id_key" ON "statutory_compliance_settings"("tenant_id");

-- AddForeignKey
ALTER TABLE "statutory_compliance_settings" ADD CONSTRAINT "statutory_compliance_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RLS
ALTER TABLE "statutory_compliance_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "statutory_compliance_settings" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "statutory_compliance_settings"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
