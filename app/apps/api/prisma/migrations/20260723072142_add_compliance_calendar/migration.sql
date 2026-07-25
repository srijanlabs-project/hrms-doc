-- CreateTable
CREATE TABLE "compliance_obligations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "due_day_of_month" INTEGER NOT NULL,
    "reminder_days_before" INTEGER NOT NULL DEFAULT 3,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compliance_obligations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_tasks" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "obligation_id" UUID NOT NULL,
    "period_label" TEXT NOT NULL,
    "dueDate" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "completed_by_user_id" UUID,
    "completed_at" TIMESTAMPTZ(6),
    "evidence_file_id" UUID,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compliance_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "compliance_obligations_tenant_id_idx" ON "compliance_obligations"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_obligations_tenant_id_code_key" ON "compliance_obligations"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "compliance_tasks_tenant_id_idx" ON "compliance_tasks"("tenant_id");

-- CreateIndex
CREATE INDEX "compliance_tasks_tenant_id_status_idx" ON "compliance_tasks"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_tasks_tenant_id_obligation_id_period_label_key" ON "compliance_tasks"("tenant_id", "obligation_id", "period_label");

-- AddForeignKey
ALTER TABLE "compliance_obligations" ADD CONSTRAINT "compliance_obligations_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_tasks" ADD CONSTRAINT "compliance_tasks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_tasks" ADD CONSTRAINT "compliance_tasks_obligation_id_fkey" FOREIGN KEY ("obligation_id") REFERENCES "compliance_obligations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_tasks" ADD CONSTRAINT "compliance_tasks_evidence_file_id_fkey" FOREIGN KEY ("evidence_file_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RLS (docs/07-appendices/29-physical-schema-ddl-and-rls-pack.md)
ALTER TABLE "compliance_obligations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compliance_obligations" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "compliance_obligations"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "compliance_tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compliance_tasks" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "compliance_tasks"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
