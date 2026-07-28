-- AlterTable
ALTER TABLE "learning_courses" ADD COLUMN     "passing_score" INTEGER,
ADD COLUMN     "skill_tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "learning_enrollments" ADD COLUMN     "assessment_max_score" INTEGER,
ADD COLUMN     "assessment_passed" BOOLEAN,
ADD COLUMN     "assessment_score" INTEGER;

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_path_courses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "path_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "sequence_order" INTEGER NOT NULL,

    CONSTRAINT "learning_path_courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_path_enrollments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "path_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_path_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "learning_paths_tenant_id_idx" ON "learning_paths"("tenant_id");

-- CreateIndex
CREATE INDEX "learning_path_courses_tenant_id_idx" ON "learning_path_courses"("tenant_id");

-- CreateIndex
CREATE INDEX "learning_path_courses_tenant_id_path_id_idx" ON "learning_path_courses"("tenant_id", "path_id");

-- CreateIndex
CREATE UNIQUE INDEX "learning_path_courses_tenant_id_path_id_course_id_key" ON "learning_path_courses"("tenant_id", "path_id", "course_id");

-- CreateIndex
CREATE INDEX "learning_path_enrollments_tenant_id_idx" ON "learning_path_enrollments"("tenant_id");

-- CreateIndex
CREATE INDEX "learning_path_enrollments_tenant_id_employee_id_idx" ON "learning_path_enrollments"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "learning_path_enrollments_tenant_id_employee_id_path_id_key" ON "learning_path_enrollments"("tenant_id", "employee_id", "path_id");

-- AddForeignKey
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_courses" ADD CONSTRAINT "learning_path_courses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_courses" ADD CONSTRAINT "learning_path_courses_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_courses" ADD CONSTRAINT "learning_path_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "learning_courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_enrollments" ADD CONSTRAINT "learning_path_enrollments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_enrollments" ADD CONSTRAINT "learning_path_enrollments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_path_enrollments" ADD CONSTRAINT "learning_path_enrollments_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row-Level Security
ALTER TABLE "learning_paths" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_paths" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "learning_paths";
CREATE POLICY tenant_isolation ON "learning_paths"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "learning_path_courses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_path_courses" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "learning_path_courses";
CREATE POLICY tenant_isolation ON "learning_path_courses"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "learning_path_enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learning_path_enrollments" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "learning_path_enrollments";
CREATE POLICY tenant_isolation ON "learning_path_enrollments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
