-- CreateTable
CREATE TABLE "transfer_promotion_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "requested_by_user_id" UUID NOT NULL,
    "change_type" TEXT NOT NULL,
    "to_department_id" UUID,
    "to_designation_id" UUID,
    "to_grade_id" UUID,
    "effective_date" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Proposed',
    "decided_by_user_id" UUID,
    "decision_note" TEXT,
    "applied_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "transfer_promotion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transfer_promotion_requests_tenant_id_status_idx" ON "transfer_promotion_requests"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "transfer_promotion_requests_tenant_id_employee_id_idx" ON "transfer_promotion_requests"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "transfer_promotion_requests" ADD CONSTRAINT "transfer_promotion_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_promotion_requests" ADD CONSTRAINT "transfer_promotion_requests_to_department_id_fkey" FOREIGN KEY ("to_department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_promotion_requests" ADD CONSTRAINT "transfer_promotion_requests_to_designation_id_fkey" FOREIGN KEY ("to_designation_id") REFERENCES "designations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_promotion_requests" ADD CONSTRAINT "transfer_promotion_requests_to_grade_id_fkey" FOREIGN KEY ("to_grade_id") REFERENCES "grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer_promotion_requests" ADD CONSTRAINT "transfer_promotion_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "transfer_promotion_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transfer_promotion_requests" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "transfer_promotion_requests"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
