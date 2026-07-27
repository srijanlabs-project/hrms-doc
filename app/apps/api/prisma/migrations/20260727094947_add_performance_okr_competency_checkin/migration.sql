-- CreateTable
CREATE TABLE "key_results" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "goal_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "target_value" DOUBLE PRECISION NOT NULL,
    "current_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "key_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competency_assessments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "competency_id" UUID NOT NULL,
    "period_year" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,
    "assessed_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "competency_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "manager_id" UUID NOT NULL,
    "scheduled_date" DATE NOT NULL,
    "agenda" TEXT,
    "manager_notes" TEXT,
    "employee_notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "key_results_tenant_id_idx" ON "key_results"("tenant_id");

-- CreateIndex
CREATE INDEX "key_results_tenant_id_goal_id_idx" ON "key_results"("tenant_id", "goal_id");

-- CreateIndex
CREATE INDEX "competencies_tenant_id_idx" ON "competencies"("tenant_id");

-- CreateIndex
CREATE INDEX "competency_assessments_tenant_id_idx" ON "competency_assessments"("tenant_id");

-- CreateIndex
CREATE INDEX "competency_assessments_tenant_id_employee_id_idx" ON "competency_assessments"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "competency_assessments_tenant_id_employee_id_competency_id__key" ON "competency_assessments"("tenant_id", "employee_id", "competency_id", "period_year");

-- CreateIndex
CREATE INDEX "check_ins_tenant_id_idx" ON "check_ins"("tenant_id");

-- CreateIndex
CREATE INDEX "check_ins_tenant_id_employee_id_idx" ON "check_ins"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "check_ins_tenant_id_manager_id_idx" ON "check_ins"("tenant_id", "manager_id");

-- AddForeignKey
ALTER TABLE "key_results" ADD CONSTRAINT "key_results_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_results" ADD CONSTRAINT "key_results_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_competency_id_fkey" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_assessments" ADD CONSTRAINT "competency_assessments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "key_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "key_results" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "key_results"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "competencies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "competencies" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "competencies"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "competency_assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "competency_assessments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "competency_assessments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "check_ins" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "check_ins" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "check_ins"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
