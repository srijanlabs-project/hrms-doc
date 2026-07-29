-- CreateTable
CREATE TABLE "asset_maintenance_records" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "maintenance_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "scheduled_date" TIMESTAMPTZ(6) NOT NULL,
    "completed_date" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "asset_maintenance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_audit_cycles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "period_label" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ(6),

    CONSTRAINT "asset_audit_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_audit_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "cycle_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "status_snapshot" TEXT NOT NULL,
    "assigned_to_snapshot" TEXT,
    "finding" TEXT NOT NULL DEFAULT 'Pending',
    "reviewed_by_user_id" UUID,
    "reviewed_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_audit_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "software_licenses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "vendor" TEXT,
    "total_seats" INTEGER NOT NULL,
    "expiry_date" TIMESTAMPTZ(6),
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "software_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "software_license_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "license_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by_user_id" UUID,
    "revoked_at" TIMESTAMPTZ(6),
    "status" TEXT NOT NULL DEFAULT 'Active',

    CONSTRAINT "software_license_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asset_maintenance_records_tenant_id_idx" ON "asset_maintenance_records"("tenant_id");

-- CreateIndex
CREATE INDEX "asset_maintenance_records_tenant_id_asset_id_idx" ON "asset_maintenance_records"("tenant_id", "asset_id");

-- CreateIndex
CREATE INDEX "asset_audit_cycles_tenant_id_idx" ON "asset_audit_cycles"("tenant_id");

-- CreateIndex
CREATE INDEX "asset_audit_items_tenant_id_idx" ON "asset_audit_items"("tenant_id");

-- CreateIndex
CREATE INDEX "asset_audit_items_tenant_id_cycle_id_idx" ON "asset_audit_items"("tenant_id", "cycle_id");

-- CreateIndex
CREATE INDEX "software_licenses_tenant_id_idx" ON "software_licenses"("tenant_id");

-- CreateIndex
CREATE INDEX "software_license_assignments_tenant_id_idx" ON "software_license_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "software_license_assignments_tenant_id_license_id_idx" ON "software_license_assignments"("tenant_id", "license_id");

-- CreateIndex
CREATE INDEX "software_license_assignments_tenant_id_employee_id_idx" ON "software_license_assignments"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "asset_maintenance_records" ADD CONSTRAINT "asset_maintenance_records_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_maintenance_records" ADD CONSTRAINT "asset_maintenance_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_audit_cycles" ADD CONSTRAINT "asset_audit_cycles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_audit_items" ADD CONSTRAINT "asset_audit_items_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "asset_audit_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_audit_items" ADD CONSTRAINT "asset_audit_items_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_audit_items" ADD CONSTRAINT "asset_audit_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_licenses" ADD CONSTRAINT "software_licenses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_license_assignments" ADD CONSTRAINT "software_license_assignments_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "software_licenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_license_assignments" ADD CONSTRAINT "software_license_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_license_assignments" ADD CONSTRAINT "software_license_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "asset_maintenance_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "asset_maintenance_records" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "asset_maintenance_records";
CREATE POLICY tenant_isolation ON "asset_maintenance_records"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "asset_audit_cycles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "asset_audit_cycles" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "asset_audit_cycles";
CREATE POLICY tenant_isolation ON "asset_audit_cycles"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "asset_audit_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "asset_audit_items" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "asset_audit_items";
CREATE POLICY tenant_isolation ON "asset_audit_items"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "software_licenses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "software_licenses" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "software_licenses";
CREATE POLICY tenant_isolation ON "software_licenses"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "software_license_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "software_license_assignments" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "software_license_assignments";
CREATE POLICY tenant_isolation ON "software_license_assignments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
