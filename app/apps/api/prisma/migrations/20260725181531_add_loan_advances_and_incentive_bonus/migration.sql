-- CreateTable
CREATE TABLE "loan_advances" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "principal" DOUBLE PRECISION NOT NULL,
    "monthly_installment" DOUBLE PRECISION NOT NULL,
    "outstanding_balance" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Requested',
    "decided_by_user_id" UUID,
    "decision_note" TEXT,
    "decided_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_advances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incentive_bonuses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "pay_type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "posted_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incentive_bonuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loan_advances_tenant_id_idx" ON "loan_advances"("tenant_id");

-- CreateIndex
CREATE INDEX "loan_advances_tenant_id_employee_id_idx" ON "loan_advances"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "incentive_bonuses_tenant_id_idx" ON "incentive_bonuses"("tenant_id");

-- CreateIndex
CREATE INDEX "incentive_bonuses_tenant_id_employee_id_idx" ON "incentive_bonuses"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "loan_advances" ADD CONSTRAINT "loan_advances_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_advances" ADD CONSTRAINT "loan_advances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incentive_bonuses" ADD CONSTRAINT "incentive_bonuses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incentive_bonuses" ADD CONSTRAINT "incentive_bonuses_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "loan_advances" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "loan_advances" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "loan_advances"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "incentive_bonuses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "incentive_bonuses" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "incentive_bonuses"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
