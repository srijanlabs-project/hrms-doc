-- CreateTable
CREATE TABLE "safety_incidents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "reported_by_employee_id" UUID NOT NULL,
    "incident_date" DATE NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'Medium',
    "status" TEXT NOT NULL DEFAULT 'Reported',
    "investigation_notes" TEXT,
    "resolved_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "safety_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_assessments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "assessed_date" DATE NOT NULL,
    "conducted_by_employee_id" UUID,
    "findings" TEXT,
    "risk_level" TEXT NOT NULL DEFAULT 'Low',
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "safety_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_records" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "record_date" DATE NOT NULL,
    "provider" TEXT,
    "notes" TEXT,
    "next_due_date" DATE,
    "evidence_file_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_response_contacts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emergency_response_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "safety_incidents_tenant_id_idx" ON "safety_incidents"("tenant_id");

-- CreateIndex
CREATE INDEX "safety_incidents_tenant_id_status_idx" ON "safety_incidents"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "safety_assessments_tenant_id_idx" ON "safety_assessments"("tenant_id");

-- CreateIndex
CREATE INDEX "health_records_tenant_id_idx" ON "health_records"("tenant_id");

-- CreateIndex
CREATE INDEX "health_records_tenant_id_employee_id_idx" ON "health_records"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "emergency_response_contacts_tenant_id_idx" ON "emergency_response_contacts"("tenant_id");

-- AddForeignKey
ALTER TABLE "safety_incidents" ADD CONSTRAINT "safety_incidents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_incidents" ADD CONSTRAINT "safety_incidents_reported_by_employee_id_fkey" FOREIGN KEY ("reported_by_employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_assessments" ADD CONSTRAINT "safety_assessments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_assessments" ADD CONSTRAINT "safety_assessments_conducted_by_employee_id_fkey" FOREIGN KEY ("conducted_by_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_records" ADD CONSTRAINT "health_records_evidence_file_id_fkey" FOREIGN KEY ("evidence_file_id") REFERENCES "stored_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_response_contacts" ADD CONSTRAINT "emergency_response_contacts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "safety_incidents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "safety_incidents" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "safety_incidents"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "safety_assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "safety_assessments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "safety_assessments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "health_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "health_records" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "health_records"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "emergency_response_contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "emergency_response_contacts" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "emergency_response_contacts"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
