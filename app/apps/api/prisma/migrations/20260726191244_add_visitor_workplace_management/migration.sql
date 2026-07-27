-- CreateTable
CREATE TABLE "visitors" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "purpose" TEXT,
    "host_employee_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Requested',
    "approved_at" TIMESTAMPTZ(6),
    "checked_in_at" TIMESTAMPTZ(6),
    "checked_out_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workplace_resources" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workplace_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workplace_bookings" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "booking_date" DATE NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Confirmed',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workplace_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visitors_tenant_id_idx" ON "visitors"("tenant_id");

-- CreateIndex
CREATE INDEX "visitors_tenant_id_status_idx" ON "visitors"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "workplace_resources_tenant_id_idx" ON "workplace_resources"("tenant_id");

-- CreateIndex
CREATE INDEX "workplace_bookings_tenant_id_idx" ON "workplace_bookings"("tenant_id");

-- CreateIndex
CREATE INDEX "workplace_bookings_tenant_id_resource_id_booking_date_idx" ON "workplace_bookings"("tenant_id", "resource_id", "booking_date");

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_host_employee_id_fkey" FOREIGN KEY ("host_employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_resources" ADD CONSTRAINT "workplace_resources_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_bookings" ADD CONSTRAINT "workplace_bookings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_bookings" ADD CONSTRAINT "workplace_bookings_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "workplace_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workplace_bookings" ADD CONSTRAINT "workplace_bookings_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RLS
ALTER TABLE "visitors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "visitors" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "visitors"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "workplace_resources" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workplace_resources" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "workplace_resources"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "workplace_bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workplace_bookings" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "workplace_bookings"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
