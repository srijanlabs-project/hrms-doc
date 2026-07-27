-- CreateTable
CREATE TABLE "report_definitions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "selected_fields" TEXT[],
    "filters" JSONB,
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "report_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_definitions_tenant_id_idx" ON "report_definitions"("tenant_id");

-- AddForeignKey
ALTER TABLE "report_definitions" ADD CONSTRAINT "report_definitions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Row-Level Security
ALTER TABLE "report_definitions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "report_definitions" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "report_definitions"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
