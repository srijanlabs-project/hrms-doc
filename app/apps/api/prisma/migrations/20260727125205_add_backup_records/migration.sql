-- AlterTable
ALTER TABLE "stored_files" ALTER COLUMN "uploaded_by_user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "backup_records" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Succeeded',
    "triggered_by" TEXT NOT NULL,
    "table_counts" JSONB NOT NULL,
    "error_message" TEXT,
    "file_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backup_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "backup_records_tenant_id_idx" ON "backup_records"("tenant_id");

-- AddForeignKey
ALTER TABLE "backup_records" ADD CONSTRAINT "backup_records_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backup_records" ADD CONSTRAINT "backup_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "backup_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "backup_records" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "backup_records"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
