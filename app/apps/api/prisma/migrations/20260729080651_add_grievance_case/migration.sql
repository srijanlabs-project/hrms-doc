-- CreateTable
CREATE TABLE "grievance_cases" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "case_type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Received',
    "assigned_handler_id" UUID,
    "resolution_summary" TEXT,
    "resolved_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "grievance_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "grievance_cases_tenant_id_status_idx" ON "grievance_cases"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "grievance_cases_tenant_id_employee_id_idx" ON "grievance_cases"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "grievance_cases" ADD CONSTRAINT "grievance_cases_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance_cases" ADD CONSTRAINT "grievance_cases_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance_cases" ADD CONSTRAINT "grievance_cases_assigned_handler_id_fkey" FOREIGN KEY ("assigned_handler_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "grievance_cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "grievance_cases" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "grievance_cases";
CREATE POLICY tenant_isolation ON "grievance_cases"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
