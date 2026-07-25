-- CreateTable
CREATE TABLE "travel_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "trip_type" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "estimated_cost" DOUBLE PRECISION,
    "purpose" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "approver_id" UUID,
    "decision_note" TEXT,
    "decided_at" TIMESTAMPTZ(6),
    "decided_by_user_id" UUID,
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "travel_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "travel_requests_tenant_id_idx" ON "travel_requests"("tenant_id");

-- CreateIndex
CREATE INDEX "travel_requests_tenant_id_employee_id_idx" ON "travel_requests"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "travel_requests_tenant_id_approver_id_idx" ON "travel_requests"("tenant_id", "approver_id");

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_requests" ADD CONSTRAINT "travel_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table: FORCE + NULLIF(...) so a
-- connection with no app.tenant_id set fails closed to zero rows (see
-- migration 20260719190000_fix_tenant_isolation_empty_guc).

ALTER TABLE "travel_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "travel_requests" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "travel_requests"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
