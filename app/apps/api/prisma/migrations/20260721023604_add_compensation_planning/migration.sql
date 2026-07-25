-- CreateTable
CREATE TABLE "compensation_review_cycles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "period_year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "compensation_review_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compensation_review_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "cycle_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "current_monthly_basic" DOUBLE PRECISION NOT NULL,
    "proposed_monthly_basic" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Proposed',
    "applied_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "compensation_review_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "compensation_review_cycles_tenant_id_idx" ON "compensation_review_cycles"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_review_cycles_tenant_id_period_year_key" ON "compensation_review_cycles"("tenant_id", "period_year");

-- CreateIndex
CREATE INDEX "compensation_review_items_tenant_id_idx" ON "compensation_review_items"("tenant_id");

-- CreateIndex
CREATE INDEX "compensation_review_items_tenant_id_cycle_id_idx" ON "compensation_review_items"("tenant_id", "cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "compensation_review_items_tenant_id_cycle_id_employee_id_key" ON "compensation_review_items"("tenant_id", "cycle_id", "employee_id");

-- AddForeignKey
ALTER TABLE "compensation_review_cycles" ADD CONSTRAINT "compensation_review_cycles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_review_items" ADD CONSTRAINT "compensation_review_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_review_items" ADD CONSTRAINT "compensation_review_items_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "compensation_review_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compensation_review_items" ADD CONSTRAINT "compensation_review_items_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table: FORCE + NULLIF(...) so a
-- connection with no app.tenant_id set fails closed to zero rows (see
-- migration 20260719190000_fix_tenant_isolation_empty_guc).

ALTER TABLE "compensation_review_cycles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compensation_review_cycles" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "compensation_review_cycles"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "compensation_review_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compensation_review_items" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "compensation_review_items"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
