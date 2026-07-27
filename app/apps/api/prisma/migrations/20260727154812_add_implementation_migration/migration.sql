-- CreateTable
CREATE TABLE "import_batches" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "entity_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Committed',
    "total_rows" INTEGER NOT NULL,
    "success_count" INTEGER NOT NULL,
    "failure_count" INTEGER NOT NULL,
    "triggered_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rolled_back_at" TIMESTAMPTZ(6),

    CONSTRAINT "import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_batch_rows" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "row_index" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error_message" TEXT,
    "created_entity_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_batch_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "go_live_checklist_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_by_user_id" UUID,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "go_live_checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_batches_tenant_id_idx" ON "import_batches"("tenant_id");

-- CreateIndex
CREATE INDEX "import_batch_rows_tenant_id_idx" ON "import_batch_rows"("tenant_id");

-- CreateIndex
CREATE INDEX "import_batch_rows_tenant_id_batch_id_idx" ON "import_batch_rows"("tenant_id", "batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "go_live_checklist_items_tenant_id_key_key" ON "go_live_checklist_items"("tenant_id", "key");

-- AddForeignKey
ALTER TABLE "import_batches" ADD CONSTRAINT "import_batches_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch_rows" ADD CONSTRAINT "import_batch_rows_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "import_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_batch_rows" ADD CONSTRAINT "import_batch_rows_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "go_live_checklist_items" ADD CONSTRAINT "go_live_checklist_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "import_batches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "import_batches" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "import_batches"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "import_batch_rows" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "import_batch_rows" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "import_batch_rows"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "go_live_checklist_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "go_live_checklist_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "go_live_checklist_items"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
