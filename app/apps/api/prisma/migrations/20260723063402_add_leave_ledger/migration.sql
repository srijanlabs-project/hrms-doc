-- AlterTable
ALTER TABLE "leave_policies" ADD COLUMN     "carry_forward_cap_days" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "leave_ledger_entries" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "leave_type" TEXT NOT NULL,
    "period_year" INTEGER NOT NULL,
    "entry_type" TEXT NOT NULL,
    "amount_days" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "posted_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leave_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leave_ledger_entries_tenant_id_idx" ON "leave_ledger_entries"("tenant_id");

-- CreateIndex
CREATE INDEX "leave_ledger_entries_tenant_id_employee_id_leave_type_perio_idx" ON "leave_ledger_entries"("tenant_id", "employee_id", "leave_type", "period_year");

-- AddForeignKey
ALTER TABLE "leave_ledger_entries" ADD CONSTRAINT "leave_ledger_entries_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_ledger_entries" ADD CONSTRAINT "leave_ledger_entries_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_ledger_entries" ADD CONSTRAINT "leave_ledger_entries_tenant_id_leave_type_fkey" FOREIGN KEY ("tenant_id", "leave_type") REFERENCES "leave_policies"("tenant_id", "leave_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RLS (docs/07-appendices/29-physical-schema-ddl-and-rls-pack.md)
ALTER TABLE "leave_ledger_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leave_ledger_entries" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "leave_ledger_entries"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
