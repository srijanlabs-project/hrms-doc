-- AlterTable
ALTER TABLE "payroll_run_results" ADD COLUMN     "arrears_included" DOUBLE PRECISION,
ADD COLUMN     "other_deductions" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "pay_components" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "calculation_method" TEXT NOT NULL,
    "default_value" DOUBLE PRECISION NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pay_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_pay_components" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "pay_component_id" UUID NOT NULL,
    "value" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "employee_pay_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arrear_entries" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payroll_run_id" UUID,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arrear_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fnf_cases" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "exit_date" DATE NOT NULL,
    "final_month_net_pay" DOUBLE PRECISION NOT NULL,
    "leave_encashment" DOUBLE PRECISION NOT NULL,
    "arrears_included" DOUBLE PRECISION NOT NULL,
    "net_payable" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by_user_id" UUID,
    "approved_at" TIMESTAMPTZ(6),
    "released_at" TIMESTAMPTZ(6),

    CONSTRAINT "fnf_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pay_components_tenant_id_idx" ON "pay_components"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "pay_components_tenant_id_code_key" ON "pay_components"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "employee_pay_components_tenant_id_idx" ON "employee_pay_components"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_pay_components_tenant_id_employee_id_idx" ON "employee_pay_components"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_pay_components_tenant_id_employee_id_pay_component_key" ON "employee_pay_components"("tenant_id", "employee_id", "pay_component_id");

-- CreateIndex
CREATE INDEX "arrear_entries_tenant_id_idx" ON "arrear_entries"("tenant_id");

-- CreateIndex
CREATE INDEX "arrear_entries_tenant_id_employee_id_status_idx" ON "arrear_entries"("tenant_id", "employee_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "fnf_cases_employee_id_key" ON "fnf_cases"("employee_id");

-- CreateIndex
CREATE INDEX "fnf_cases_tenant_id_idx" ON "fnf_cases"("tenant_id");

-- AddForeignKey
ALTER TABLE "pay_components" ADD CONSTRAINT "pay_components_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_pay_components" ADD CONSTRAINT "employee_pay_components_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_pay_components" ADD CONSTRAINT "employee_pay_components_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_pay_components" ADD CONSTRAINT "employee_pay_components_pay_component_id_fkey" FOREIGN KEY ("pay_component_id") REFERENCES "pay_components"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrear_entries" ADD CONSTRAINT "arrear_entries_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrear_entries" ADD CONSTRAINT "arrear_entries_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrear_entries" ADD CONSTRAINT "arrear_entries_payroll_run_id_fkey" FOREIGN KEY ("payroll_run_id") REFERENCES "payroll_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnf_cases" ADD CONSTRAINT "fnf_cases_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fnf_cases" ADD CONSTRAINT "fnf_cases_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RLS (docs/07-appendices/29-physical-schema-ddl-and-rls-pack.md)
ALTER TABLE "pay_components" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pay_components" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "pay_components"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employee_pay_components" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_pay_components" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "employee_pay_components"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "arrear_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "arrear_entries" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "arrear_entries"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "fnf_cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fnf_cases" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "fnf_cases"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
