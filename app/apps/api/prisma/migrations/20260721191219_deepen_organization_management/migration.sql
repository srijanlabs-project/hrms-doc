-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "financial_center_id" UUID,
ADD COLUMN     "org_unit_id" UUID;

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "financial_center_id" UUID,
ADD COLUMN     "grade_id" UUID,
ADD COLUMN     "position_id" UUID,
ADD COLUMN     "worker_type" TEXT NOT NULL DEFAULT 'Permanent';

-- AlterTable
ALTER TABLE "legal_entities" ADD COLUMN     "company_id" UUID;

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "parent_company_id" UUID,
    "logo_url" TEXT,
    "primary_color" TEXT,
    "tagline" TEXT,
    "fiscal_year_start_month" INTEGER NOT NULL DEFAULT 4,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_units" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "unit_type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "parent_unit_id" UUID,
    "address_line" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "org_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_centers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "center_type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "parent_center_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "financial_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reporting_lines" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "manager_id" UUID NOT NULL,
    "line_type" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "reporting_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_families" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "job_families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_functions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "job_family_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "job_functions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "job_function_id" UUID,
    "career_track" TEXT NOT NULL DEFAULT 'IC',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grades" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "band" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "min_compensation" DOUBLE PRECISION,
    "max_compensation" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "department_id" UUID NOT NULL,
    "designation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_calendars" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "work_calendars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_calendar_days" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "calendar_id" UUID NOT NULL,
    "date_iso" DATE NOT NULL,
    "day_type" TEXT NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_calendar_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_calendar_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "calendar_id" UUID NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'Tenant',
    "scope_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_calendar_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_policies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "effective_from" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "org_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "companies_tenant_id_idx" ON "companies"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_tenant_id_code_key" ON "companies"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "org_units_tenant_id_idx" ON "org_units"("tenant_id");

-- CreateIndex
CREATE INDEX "org_units_tenant_id_unit_type_idx" ON "org_units"("tenant_id", "unit_type");

-- CreateIndex
CREATE UNIQUE INDEX "org_units_tenant_id_code_key" ON "org_units"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "financial_centers_tenant_id_idx" ON "financial_centers"("tenant_id");

-- CreateIndex
CREATE INDEX "financial_centers_tenant_id_center_type_idx" ON "financial_centers"("tenant_id", "center_type");

-- CreateIndex
CREATE UNIQUE INDEX "financial_centers_tenant_id_code_key" ON "financial_centers"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "reporting_lines_tenant_id_idx" ON "reporting_lines"("tenant_id");

-- CreateIndex
CREATE INDEX "reporting_lines_tenant_id_employee_id_idx" ON "reporting_lines"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "reporting_lines_tenant_id_manager_id_idx" ON "reporting_lines"("tenant_id", "manager_id");

-- CreateIndex
CREATE INDEX "job_families_tenant_id_idx" ON "job_families"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_families_tenant_id_code_key" ON "job_families"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "job_functions_tenant_id_idx" ON "job_functions"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_functions_tenant_id_code_key" ON "job_functions"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "designations_tenant_id_idx" ON "designations"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "designations_tenant_id_code_key" ON "designations"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "grades_tenant_id_idx" ON "grades"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "grades_tenant_id_code_key" ON "grades"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "positions_tenant_id_idx" ON "positions"("tenant_id");

-- CreateIndex
CREATE INDEX "positions_tenant_id_department_id_idx" ON "positions"("tenant_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "positions_tenant_id_code_key" ON "positions"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "work_calendars_tenant_id_idx" ON "work_calendars"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_calendars_tenant_id_code_key" ON "work_calendars"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "work_calendar_days_tenant_id_idx" ON "work_calendar_days"("tenant_id");

-- CreateIndex
CREATE INDEX "work_calendar_days_tenant_id_calendar_id_idx" ON "work_calendar_days"("tenant_id", "calendar_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_calendar_days_calendar_id_date_iso_key" ON "work_calendar_days"("calendar_id", "date_iso");

-- CreateIndex
CREATE INDEX "work_calendar_assignments_tenant_id_idx" ON "work_calendar_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "work_calendar_assignments_tenant_id_scope_scope_id_idx" ON "work_calendar_assignments"("tenant_id", "scope", "scope_id");

-- CreateIndex
CREATE INDEX "org_policies_tenant_id_idx" ON "org_policies"("tenant_id");

-- CreateIndex
CREATE INDEX "org_policies_tenant_id_category_idx" ON "org_policies"("tenant_id", "category");

-- AddForeignKey
ALTER TABLE "legal_entities" ADD CONSTRAINT "legal_entities_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_parent_company_id_fkey" FOREIGN KEY ("parent_company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_org_unit_id_fkey" FOREIGN KEY ("org_unit_id") REFERENCES "org_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_financial_center_id_fkey" FOREIGN KEY ("financial_center_id") REFERENCES "financial_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_units" ADD CONSTRAINT "org_units_parent_unit_id_fkey" FOREIGN KEY ("parent_unit_id") REFERENCES "org_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_units" ADD CONSTRAINT "org_units_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_centers" ADD CONSTRAINT "financial_centers_parent_center_id_fkey" FOREIGN KEY ("parent_center_id") REFERENCES "financial_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_centers" ADD CONSTRAINT "financial_centers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_financial_center_id_fkey" FOREIGN KEY ("financial_center_id") REFERENCES "financial_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporting_lines" ADD CONSTRAINT "reporting_lines_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporting_lines" ADD CONSTRAINT "reporting_lines_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reporting_lines" ADD CONSTRAINT "reporting_lines_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_families" ADD CONSTRAINT "job_families_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_functions" ADD CONSTRAINT "job_functions_job_family_id_fkey" FOREIGN KEY ("job_family_id") REFERENCES "job_families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_functions" ADD CONSTRAINT "job_functions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designations" ADD CONSTRAINT "designations_job_function_id_fkey" FOREIGN KEY ("job_function_id") REFERENCES "job_functions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designations" ADD CONSTRAINT "designations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_calendars" ADD CONSTRAINT "work_calendars_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_calendar_days" ADD CONSTRAINT "work_calendar_days_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "work_calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_calendar_days" ADD CONSTRAINT "work_calendar_days_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_calendar_assignments" ADD CONSTRAINT "work_calendar_assignments_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "work_calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_calendar_assignments" ADD CONSTRAINT "work_calendar_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_policies" ADD CONSTRAINT "org_policies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table: FORCE + NULLIF(...) so a
-- connection with no app.tenant_id set fails closed to zero rows (see
-- migration 20260719190000_fix_tenant_isolation_empty_guc).

ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "companies" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "companies"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "org_units" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "org_units" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "org_units"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "financial_centers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "financial_centers" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "financial_centers"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "reporting_lines" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reporting_lines" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "reporting_lines"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "job_families" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_families" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "job_families"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "job_functions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_functions" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "job_functions"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "designations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "designations" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "designations"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "grades" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grades" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "grades"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "positions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "positions" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "positions"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "work_calendars" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "work_calendars" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "work_calendars"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "work_calendar_days" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "work_calendar_days" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "work_calendar_days"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "work_calendar_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "work_calendar_assignments" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "work_calendar_assignments"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "org_policies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "org_policies" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "org_policies"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
