-- CreateTable
CREATE TABLE "benefit_plans" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "employer_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "employee_cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "max_annual_allocation" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "benefit_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_enrollments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "benefit_plan_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Enrolled',
    "effective_date" DATE NOT NULL,
    "allocated_amount" DOUBLE PRECISION,
    "waiver_reason" TEXT,
    "terminated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "benefit_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flex_basket_policies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "annual_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "flex_basket_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "benefit_plans_tenant_id_idx" ON "benefit_plans"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_plans_tenant_id_code_key" ON "benefit_plans"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "benefit_enrollments_tenant_id_idx" ON "benefit_enrollments"("tenant_id");

-- CreateIndex
CREATE INDEX "benefit_enrollments_tenant_id_employee_id_idx" ON "benefit_enrollments"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_enrollments_tenant_id_employee_id_benefit_plan_id_key" ON "benefit_enrollments"("tenant_id", "employee_id", "benefit_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "flex_basket_policies_tenant_id_key" ON "flex_basket_policies"("tenant_id");

-- AddForeignKey
ALTER TABLE "benefit_plans" ADD CONSTRAINT "benefit_plans_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_enrollments" ADD CONSTRAINT "benefit_enrollments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_enrollments" ADD CONSTRAINT "benefit_enrollments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benefit_enrollments" ADD CONSTRAINT "benefit_enrollments_benefit_plan_id_fkey" FOREIGN KEY ("benefit_plan_id") REFERENCES "benefit_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flex_basket_policies" ADD CONSTRAINT "flex_basket_policies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "benefit_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "benefit_plans" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "benefit_plans"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "benefit_enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "benefit_enrollments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "benefit_enrollments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "flex_basket_policies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "flex_basket_policies" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "flex_basket_policies"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
