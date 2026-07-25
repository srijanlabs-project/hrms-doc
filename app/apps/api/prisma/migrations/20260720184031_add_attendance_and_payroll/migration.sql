-- CreateTable
CREATE TABLE "attendance_days" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'Manual',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "attendance_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_compensations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "monthly_basic" DOUBLE PRECISION NOT NULL,
    "effective_from" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "employee_compensations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_runs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "period_year" INTEGER NOT NULL,
    "period_month" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "processed_at" TIMESTAMPTZ(6),
    "approved_at" TIMESTAMPTZ(6),
    "approved_by_user_id" UUID,
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_run_results" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "payroll_run_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "payable_days" DOUBLE PRECISION NOT NULL,
    "total_working_days" DOUBLE PRECISION NOT NULL,
    "basic" DOUBLE PRECISION,
    "hra" DOUBLE PRECISION,
    "special_allowance" DOUBLE PRECISION,
    "gross_earnings" DOUBLE PRECISION,
    "pf_employee" DOUBLE PRECISION,
    "pf_employer" DOUBLE PRECISION,
    "esic_employee" DOUBLE PRECISION,
    "esic_employer" DOUBLE PRECISION,
    "professional_tax" DOUBLE PRECISION,
    "tds" DOUBLE PRECISION,
    "net_pay" DOUBLE PRECISION,
    "has_exception" BOOLEAN NOT NULL DEFAULT false,
    "exception_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payroll_run_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attendance_days_tenant_id_idx" ON "attendance_days"("tenant_id");

-- CreateIndex
CREATE INDEX "attendance_days_tenant_id_employee_id_idx" ON "attendance_days"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_days_tenant_id_employee_id_date_key" ON "attendance_days"("tenant_id", "employee_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "employee_compensations_employee_id_key" ON "employee_compensations"("employee_id");

-- CreateIndex
CREATE INDEX "employee_compensations_tenant_id_idx" ON "employee_compensations"("tenant_id");

-- CreateIndex
CREATE INDEX "payroll_runs_tenant_id_idx" ON "payroll_runs"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_runs_tenant_id_period_year_period_month_key" ON "payroll_runs"("tenant_id", "period_year", "period_month");

-- CreateIndex
CREATE INDEX "payroll_run_results_tenant_id_idx" ON "payroll_run_results"("tenant_id");

-- CreateIndex
CREATE INDEX "payroll_run_results_tenant_id_employee_id_idx" ON "payroll_run_results"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "payroll_run_results_payroll_run_id_employee_id_key" ON "payroll_run_results"("payroll_run_id", "employee_id");

-- AddForeignKey
ALTER TABLE "attendance_days" ADD CONSTRAINT "attendance_days_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_days" ADD CONSTRAINT "attendance_days_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_compensations" ADD CONSTRAINT "employee_compensations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_run_results" ADD CONSTRAINT "payroll_run_results_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_run_results" ADD CONSTRAINT "payroll_run_results_payroll_run_id_fkey" FOREIGN KEY ("payroll_run_id") REFERENCES "payroll_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_run_results" ADD CONSTRAINT "payroll_run_results_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table: FORCE + NULLIF(...) so a
-- connection with no app.tenant_id set fails closed to zero rows (see
-- migration 20260719190000_fix_tenant_isolation_empty_guc).

ALTER TABLE "attendance_days" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "attendance_days" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "attendance_days"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employee_compensations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_compensations" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "employee_compensations"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "payroll_runs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payroll_runs" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "payroll_runs"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "payroll_run_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payroll_run_results" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "payroll_run_results"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
