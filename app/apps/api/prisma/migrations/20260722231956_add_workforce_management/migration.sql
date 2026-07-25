-- CreateTable
CREATE TABLE "shift_definitions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "cross_midnight" BOOLEAN NOT NULL DEFAULT false,
    "planned_minutes" INTEGER NOT NULL,
    "grace_minutes" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "shift_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "shift_id" UUID NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shift_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_entries" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "shift_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "roster_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roster_swap_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "roster_entry_id" UUID NOT NULL,
    "requested_by_employee_id" UUID NOT NULL,
    "counterpart_employee_id" UUID NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "decision_note" TEXT,
    "decided_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roster_swap_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timesheet_entries" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "activity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "approver_id" UUID,
    "decision_note" TEXT,
    "decided_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "timesheet_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "overtime_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "hours_requested" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "approver_id" UUID,
    "payable_amount" DOUBLE PRECISION,
    "decision_note" TEXT,
    "decided_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "overtime_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shift_definitions_tenant_id_idx" ON "shift_definitions"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "shift_definitions_tenant_id_code_key" ON "shift_definitions"("tenant_id", "code");

-- CreateIndex
CREATE INDEX "shift_assignments_tenant_id_idx" ON "shift_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "shift_assignments_tenant_id_employee_id_idx" ON "shift_assignments"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "roster_entries_tenant_id_idx" ON "roster_entries"("tenant_id");

-- CreateIndex
CREATE INDEX "roster_entries_tenant_id_date_idx" ON "roster_entries"("tenant_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "roster_entries_tenant_id_employee_id_date_key" ON "roster_entries"("tenant_id", "employee_id", "date");

-- CreateIndex
CREATE INDEX "roster_swap_requests_tenant_id_idx" ON "roster_swap_requests"("tenant_id");

-- CreateIndex
CREATE INDEX "timesheet_entries_tenant_id_idx" ON "timesheet_entries"("tenant_id");

-- CreateIndex
CREATE INDEX "timesheet_entries_tenant_id_employee_id_date_idx" ON "timesheet_entries"("tenant_id", "employee_id", "date");

-- CreateIndex
CREATE INDEX "overtime_requests_tenant_id_idx" ON "overtime_requests"("tenant_id");

-- CreateIndex
CREATE INDEX "overtime_requests_tenant_id_employee_id_idx" ON "overtime_requests"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "shift_definitions" ADD CONSTRAINT "shift_definitions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shift_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_entries" ADD CONSTRAINT "roster_entries_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_entries" ADD CONSTRAINT "roster_entries_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_entries" ADD CONSTRAINT "roster_entries_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shift_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_swap_requests" ADD CONSTRAINT "roster_swap_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roster_swap_requests" ADD CONSTRAINT "roster_swap_requests_roster_entry_id_fkey" FOREIGN KEY ("roster_entry_id") REFERENCES "roster_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheet_entries" ADD CONSTRAINT "timesheet_entries_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheet_entries" ADD CONSTRAINT "timesheet_entries_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_requests" ADD CONSTRAINT "overtime_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_requests" ADD CONSTRAINT "overtime_requests_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RLS (docs/07-appendices/29-physical-schema-ddl-and-rls-pack.md)
ALTER TABLE "shift_definitions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shift_definitions" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "shift_definitions"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "shift_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shift_assignments" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "shift_assignments"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "roster_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "roster_entries" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "roster_entries"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "roster_swap_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "roster_swap_requests" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "roster_swap_requests"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "timesheet_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "timesheet_entries" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "timesheet_entries"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "overtime_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "overtime_requests" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "overtime_requests"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
