-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "parent_department_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_code" TEXT NOT NULL,
    "legal_name" TEXT NOT NULL,
    "preferred_name" TEXT,
    "date_of_birth" DATE,
    "personal_email" TEXT,
    "mobile_number" TEXT,
    "department_id" UUID,
    "manager_id" UUID,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "joining_date" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "departments_tenant_id_idx" ON "departments"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_tenant_id_code_key" ON "departments"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "employees_tenant_id_idx" ON "employees"("tenant_id");

-- CreateIndex
CREATE INDEX "employees_tenant_id_department_id_idx" ON "employees"("tenant_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_tenant_id_employee_code_key" ON "employees"("tenant_id", "employee_code");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as legal_entities (see migrations 20260719000000_init_tenancy
-- and 20260719190000_fix_tenant_isolation_empty_guc): FORCE so the policy
-- applies even to the owning `staffsy` role, and NULLIF(..., '') so a
-- connection with no app.tenant_id set — fresh or previously used — fails
-- closed to zero rows instead of erroring on an empty-string uuid cast.

ALTER TABLE "departments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "departments" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "departments"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employees" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "employees"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
