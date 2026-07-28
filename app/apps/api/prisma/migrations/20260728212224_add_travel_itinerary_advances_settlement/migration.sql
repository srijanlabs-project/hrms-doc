-- AlterTable
ALTER TABLE "expense_claims" ADD COLUMN     "travel_request_id" UUID;

-- CreateTable
CREATE TABLE "travel_itinerary_segments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "travel_request_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "from_location" TEXT NOT NULL,
    "to_location" TEXT NOT NULL,
    "depart_at" TIMESTAMPTZ(6) NOT NULL,
    "arrive_at" TIMESTAMPTZ(6),
    "booking_reference" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "travel_itinerary_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_advances" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "travel_request_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "requested_amount" DOUBLE PRECISION NOT NULL,
    "approved_amount" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'Requested',
    "decision_note" TEXT,
    "decided_at" TIMESTAMPTZ(6),
    "decided_by_user_id" UUID,
    "disbursed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "travel_advances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "travel_itinerary_segments_tenant_id_idx" ON "travel_itinerary_segments"("tenant_id");

-- CreateIndex
CREATE INDEX "travel_itinerary_segments_tenant_id_travel_request_id_idx" ON "travel_itinerary_segments"("tenant_id", "travel_request_id");

-- CreateIndex
CREATE INDEX "travel_advances_tenant_id_idx" ON "travel_advances"("tenant_id");

-- CreateIndex
CREATE INDEX "travel_advances_tenant_id_travel_request_id_idx" ON "travel_advances"("tenant_id", "travel_request_id");

-- CreateIndex
CREATE INDEX "travel_advances_tenant_id_employee_id_idx" ON "travel_advances"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "expense_claims_tenant_id_travel_request_id_idx" ON "expense_claims"("tenant_id", "travel_request_id");

-- AddForeignKey
ALTER TABLE "expense_claims" ADD CONSTRAINT "expense_claims_travel_request_id_fkey" FOREIGN KEY ("travel_request_id") REFERENCES "travel_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_itinerary_segments" ADD CONSTRAINT "travel_itinerary_segments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_itinerary_segments" ADD CONSTRAINT "travel_itinerary_segments_travel_request_id_fkey" FOREIGN KEY ("travel_request_id") REFERENCES "travel_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_advances" ADD CONSTRAINT "travel_advances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_advances" ADD CONSTRAINT "travel_advances_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_advances" ADD CONSTRAINT "travel_advances_travel_request_id_fkey" FOREIGN KEY ("travel_request_id") REFERENCES "travel_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security (hand-appended, see docs/07-appendices/24)
ALTER TABLE "travel_itinerary_segments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "travel_itinerary_segments" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "travel_itinerary_segments";
CREATE POLICY tenant_isolation ON "travel_itinerary_segments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "travel_advances" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "travel_advances" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "travel_advances";
CREATE POLICY tenant_isolation ON "travel_advances"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
