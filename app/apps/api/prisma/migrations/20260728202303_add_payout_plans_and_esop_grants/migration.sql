-- CreateTable
CREATE TABLE "payout_plan_cycles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "period_year" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "pay_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payout_plan_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_plan_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "cycle_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "proposed_amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Proposed',
    "decision_note" TEXT,
    "posted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "payout_plan_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "esop_grants" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "total_units" INTEGER NOT NULL,
    "grant_date" DATE NOT NULL,
    "vesting_start_date" DATE NOT NULL,
    "vesting_years" INTEGER NOT NULL,
    "cliff_months" INTEGER NOT NULL DEFAULT 12,
    "exercise_price" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "esop_grants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payout_plan_cycles_tenant_id_idx" ON "payout_plan_cycles"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "payout_plan_cycles_tenant_id_period_year_pay_type_label_key" ON "payout_plan_cycles"("tenant_id", "period_year", "pay_type", "label");

-- CreateIndex
CREATE INDEX "payout_plan_items_tenant_id_idx" ON "payout_plan_items"("tenant_id");

-- CreateIndex
CREATE INDEX "payout_plan_items_tenant_id_cycle_id_idx" ON "payout_plan_items"("tenant_id", "cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "payout_plan_items_tenant_id_cycle_id_employee_id_key" ON "payout_plan_items"("tenant_id", "cycle_id", "employee_id");

-- CreateIndex
CREATE INDEX "esop_grants_tenant_id_idx" ON "esop_grants"("tenant_id");

-- CreateIndex
CREATE INDEX "esop_grants_tenant_id_employee_id_idx" ON "esop_grants"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "payout_plan_cycles" ADD CONSTRAINT "payout_plan_cycles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_plan_items" ADD CONSTRAINT "payout_plan_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_plan_items" ADD CONSTRAINT "payout_plan_items_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "payout_plan_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_plan_items" ADD CONSTRAINT "payout_plan_items_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esop_grants" ADD CONSTRAINT "esop_grants_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esop_grants" ADD CONSTRAINT "esop_grants_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Row-Level Security
ALTER TABLE "payout_plan_cycles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payout_plan_cycles" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "payout_plan_cycles";
CREATE POLICY tenant_isolation ON "payout_plan_cycles"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "payout_plan_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payout_plan_items" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "payout_plan_items";
CREATE POLICY tenant_isolation ON "payout_plan_items"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "esop_grants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "esop_grants" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "esop_grants";
CREATE POLICY tenant_isolation ON "esop_grants"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
