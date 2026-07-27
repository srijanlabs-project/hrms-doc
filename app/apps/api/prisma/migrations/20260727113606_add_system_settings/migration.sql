-- CreateTable
CREATE TABLE "system_settings" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_tenant_id_key_key" ON "system_settings"("tenant_id", "key");

-- AddForeignKey
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "system_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "system_settings" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "system_settings"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
