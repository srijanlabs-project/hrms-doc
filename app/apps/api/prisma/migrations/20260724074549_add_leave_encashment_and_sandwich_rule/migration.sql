-- AlterTable
ALTER TABLE "leave_policies" ADD COLUMN     "sandwich_rule_enabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "leave_encashment_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "leave_type" TEXT NOT NULL,
    "days" DOUBLE PRECISION NOT NULL,
    "rate_per_day" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "decided_by_user_id" UUID,
    "decision_note" TEXT,
    "decided_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_encashment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leave_encashment_requests_tenant_id_idx" ON "leave_encashment_requests"("tenant_id");

-- CreateIndex
CREATE INDEX "leave_encashment_requests_tenant_id_employee_id_idx" ON "leave_encashment_requests"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "leave_encashment_requests" ADD CONSTRAINT "leave_encashment_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_encashment_requests" ADD CONSTRAINT "leave_encashment_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_encashment_requests" ADD CONSTRAINT "leave_encashment_requests_tenant_id_leave_type_fkey" FOREIGN KEY ("tenant_id", "leave_type") REFERENCES "leave_policies"("tenant_id", "leave_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "leave_encashment_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leave_encashment_requests" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "leave_encashment_requests"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
