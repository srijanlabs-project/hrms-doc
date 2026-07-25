-- AlterTable
ALTER TABLE "attendance_days" ADD COLUMN     "check_in_time" TEXT,
ADD COLUMN     "check_out_time" TEXT,
ADD COLUMN     "flex_compliant" BOOLEAN;

-- AlterTable
ALTER TABLE "overtime_requests" ADD COLUMN     "comp_off_days_credited" DOUBLE PRECISION,
ADD COLUMN     "settlement_type" TEXT NOT NULL DEFAULT 'Payable';

-- CreateTable
CREATE TABLE "flexible_hours_policies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "core_start_time" TEXT NOT NULL,
    "core_end_time" TEXT NOT NULL,
    "required_daily_minutes" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "flexible_hours_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_flex_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "policy_id" UUID NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_flex_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_rotation_patterns" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "cadence_weeks" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shift_rotation_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift_rotation_steps" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "pattern_id" UUID NOT NULL,
    "week_index" INTEGER NOT NULL,
    "shift_id" UUID NOT NULL,

    CONSTRAINT "shift_rotation_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_rotation_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "pattern_id" UUID NOT NULL,
    "anchor_week_start" DATE NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_rotation_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flexible_hours_policies_tenant_id_idx" ON "flexible_hours_policies"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "flexible_hours_policies_tenant_id_name_key" ON "flexible_hours_policies"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "employee_flex_assignments_tenant_id_idx" ON "employee_flex_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_flex_assignments_tenant_id_employee_id_idx" ON "employee_flex_assignments"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "shift_rotation_patterns_tenant_id_idx" ON "shift_rotation_patterns"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "shift_rotation_patterns_tenant_id_name_key" ON "shift_rotation_patterns"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "shift_rotation_steps_tenant_id_idx" ON "shift_rotation_steps"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "shift_rotation_steps_tenant_id_pattern_id_week_index_key" ON "shift_rotation_steps"("tenant_id", "pattern_id", "week_index");

-- CreateIndex
CREATE INDEX "employee_rotation_assignments_tenant_id_idx" ON "employee_rotation_assignments"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_rotation_assignments_tenant_id_employee_id_idx" ON "employee_rotation_assignments"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "flexible_hours_policies" ADD CONSTRAINT "flexible_hours_policies_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_flex_assignments" ADD CONSTRAINT "employee_flex_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_flex_assignments" ADD CONSTRAINT "employee_flex_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_flex_assignments" ADD CONSTRAINT "employee_flex_assignments_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "flexible_hours_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_rotation_patterns" ADD CONSTRAINT "shift_rotation_patterns_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_rotation_steps" ADD CONSTRAINT "shift_rotation_steps_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_rotation_steps" ADD CONSTRAINT "shift_rotation_steps_pattern_id_fkey" FOREIGN KEY ("pattern_id") REFERENCES "shift_rotation_patterns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shift_rotation_steps" ADD CONSTRAINT "shift_rotation_steps_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shift_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_rotation_assignments" ADD CONSTRAINT "employee_rotation_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_rotation_assignments" ADD CONSTRAINT "employee_rotation_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_rotation_assignments" ADD CONSTRAINT "employee_rotation_assignments_pattern_id_fkey" FOREIGN KEY ("pattern_id") REFERENCES "shift_rotation_patterns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "flexible_hours_policies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "flexible_hours_policies" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "flexible_hours_policies"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employee_flex_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_flex_assignments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "employee_flex_assignments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "shift_rotation_patterns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shift_rotation_patterns" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "shift_rotation_patterns"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "shift_rotation_steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shift_rotation_steps" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "shift_rotation_steps"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employee_rotation_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_rotation_assignments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "employee_rotation_assignments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
