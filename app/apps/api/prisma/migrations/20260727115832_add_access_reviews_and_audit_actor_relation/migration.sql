-- CreateTable
CREATE TABLE "access_review_cycles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "period_label" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ(6),

    CONSTRAINT "access_review_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_review_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "cycle_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "roles_snapshot" TEXT[],
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "reviewed_by_user_id" UUID,
    "reviewed_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_review_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "access_review_cycles_tenant_id_idx" ON "access_review_cycles"("tenant_id");

-- CreateIndex
CREATE INDEX "access_review_items_tenant_id_idx" ON "access_review_items"("tenant_id");

-- CreateIndex
CREATE INDEX "access_review_items_tenant_id_cycle_id_idx" ON "access_review_items"("tenant_id", "cycle_id");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_review_cycles" ADD CONSTRAINT "access_review_cycles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_review_items" ADD CONSTRAINT "access_review_items_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "access_review_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_review_items" ADD CONSTRAINT "access_review_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_review_items" ADD CONSTRAINT "access_review_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "access_review_cycles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "access_review_cycles" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "access_review_cycles"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "access_review_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "access_review_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "access_review_items"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
