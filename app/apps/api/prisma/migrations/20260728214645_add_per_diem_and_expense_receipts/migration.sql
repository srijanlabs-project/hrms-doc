-- AlterTable
ALTER TABLE "expense_claims" ADD COLUMN     "receipt_file_id" UUID;

-- CreateTable
CREATE TABLE "per_diem_policies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "daily_rate" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "per_diem_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "per_diem_claims" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "policy_id" UUID NOT NULL,
    "travel_request_id" UUID,
    "number_of_days" INTEGER NOT NULL,
    "computed_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "approver_id" UUID,
    "decision_note" TEXT,
    "decided_at" TIMESTAMPTZ(6),
    "decided_by_user_id" UUID,
    "paid_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "per_diem_claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "per_diem_policies_tenant_id_idx" ON "per_diem_policies"("tenant_id");

-- CreateIndex
CREATE INDEX "per_diem_claims_tenant_id_idx" ON "per_diem_claims"("tenant_id");

-- CreateIndex
CREATE INDEX "per_diem_claims_tenant_id_employee_id_idx" ON "per_diem_claims"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "per_diem_claims_tenant_id_approver_id_idx" ON "per_diem_claims"("tenant_id", "approver_id");

-- AddForeignKey
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_receipt_file_id_fkey" FOREIGN KEY ("receipt_file_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "per_diem_policies" ADD CONSTRAINT "per_diem_policies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "per_diem_claims" ADD CONSTRAINT "per_diem_claims_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "per_diem_claims" ADD CONSTRAINT "per_diem_claims_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "per_diem_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "per_diem_claims" ADD CONSTRAINT "per_diem_claims_travel_request_id_fkey" FOREIGN KEY ("travel_request_id") REFERENCES "travel_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "per_diem_claims" ADD CONSTRAINT "per_diem_claims_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "per_diem_claims" ADD CONSTRAINT "per_diem_claims_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Row Level Security (hand-appended, see docs/07-appendices/24)
ALTER TABLE "per_diem_policies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "per_diem_policies" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "per_diem_policies";
CREATE POLICY tenant_isolation ON "per_diem_policies"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "per_diem_claims" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "per_diem_claims" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "per_diem_claims";
CREATE POLICY tenant_isolation ON "per_diem_claims"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
