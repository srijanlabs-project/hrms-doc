-- CreateTable
CREATE TABLE "vendors" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_workers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "vendor_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Contractor',
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "contract_start_date" DATE NOT NULL,
    "contract_end_date" DATE NOT NULL,
    "department_id" UUID,
    "work_location" TEXT,
    "access_granted_at" TIMESTAMPTZ(6),
    "access_revoked_at" TIMESTAMPTZ(6),
    "status_reason" TEXT,
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "external_workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_worker_documents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "external_worker_id" UUID NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_id" UUID,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by_user_id" UUID,
    "verified_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_worker_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendors_tenant_id_name_key" ON "vendors"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "external_workers_tenant_id_status_idx" ON "external_workers"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "external_workers_tenant_id_vendor_id_idx" ON "external_workers"("tenant_id", "vendor_id");

-- CreateIndex
CREATE INDEX "external_worker_documents_tenant_id_external_worker_id_idx" ON "external_worker_documents"("tenant_id", "external_worker_id");

-- AddForeignKey
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_workers" ADD CONSTRAINT "external_workers_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_workers" ADD CONSTRAINT "external_workers_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_workers" ADD CONSTRAINT "external_workers_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_worker_documents" ADD CONSTRAINT "external_worker_documents_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_worker_documents" ADD CONSTRAINT "external_worker_documents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_worker_documents" ADD CONSTRAINT "external_worker_documents_external_worker_id_fkey" FOREIGN KEY ("external_worker_id") REFERENCES "external_workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "vendors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendors" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "vendors"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "external_workers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "external_workers" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "external_workers"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "external_worker_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "external_worker_documents" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "external_worker_documents"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
