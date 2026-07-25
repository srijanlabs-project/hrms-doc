-- AlterTable
ALTER TABLE "learning_courses" ADD COLUMN     "recurrence_months" INTEGER;

-- AlterTable
ALTER TABLE "learning_enrollments" ADD COLUMN     "assigned_automatically" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "due_date" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "certification_catalog" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT,
    "validity_months" INTEGER,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certification_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_records" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "certification_catalog_id" UUID NOT NULL,
    "certificate_number" TEXT,
    "issue_date" DATE NOT NULL,
    "expiry_date" DATE,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "evidence_file_id" UUID,
    "verified_by_user_id" UUID,
    "verified_at" TIMESTAMPTZ(6),
    "revoked_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "certification_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "certification_catalog_tenant_id_idx" ON "certification_catalog"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "certification_catalog_tenant_id_code_key" ON "certification_catalog"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "certification_records_tenant_id_idx" ON "certification_records"("tenant_id");

-- CreateIndex
CREATE INDEX "certification_records_tenant_id_employee_id_idx" ON "certification_records"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "certification_catalog" ADD CONSTRAINT "certification_catalog_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_records" ADD CONSTRAINT "certification_records_evidence_file_id_fkey" FOREIGN KEY ("evidence_file_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_records" ADD CONSTRAINT "certification_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_records" ADD CONSTRAINT "certification_records_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_records" ADD CONSTRAINT "certification_records_certification_catalog_id_fkey" FOREIGN KEY ("certification_catalog_id") REFERENCES "certification_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "certification_catalog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "certification_catalog" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "certification_catalog"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "certification_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "certification_records" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "certification_records"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
