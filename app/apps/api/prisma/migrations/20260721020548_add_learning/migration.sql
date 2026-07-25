-- CreateTable
CREATE TABLE "learning_courses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration_hours" INTEGER NOT NULL,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "learning_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_enrollments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Enrolled',
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "learning_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "learning_courses_tenant_id_idx" ON "learning_courses"("tenant_id");

-- CreateIndex
CREATE INDEX "learning_enrollments_tenant_id_idx" ON "learning_enrollments"("tenant_id");

-- CreateIndex
CREATE INDEX "learning_enrollments_tenant_id_employee_id_idx" ON "learning_enrollments"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "learning_enrollments_tenant_id_employee_id_course_id_key" ON "learning_enrollments"("tenant_id", "employee_id", "course_id");

-- AddForeignKey
ALTER TABLE "learning_courses" ADD CONSTRAINT "learning_courses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_enrollments" ADD CONSTRAINT "learning_enrollments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_enrollments" ADD CONSTRAINT "learning_enrollments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_enrollments" ADD CONSTRAINT "learning_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "learning_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table: FORCE + NULLIF(...) so a
-- connection with no app.tenant_id set fails closed to zero rows (see
-- migration 20260719190000_fix_tenant_isolation_empty_guc).

ALTER TABLE "learning_courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_courses" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "learning_courses"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "learning_enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_enrollments" FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON "learning_enrollments"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
