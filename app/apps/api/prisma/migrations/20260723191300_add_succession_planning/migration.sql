-- CreateTable
CREATE TABLE "critical_roles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "department_id" UUID,
    "incumbent_employee_id" UUID,
    "criticality_tier" TEXT NOT NULL DEFAULT 'Medium',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "critical_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "succession_successors" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "critical_role_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "readiness" TEXT NOT NULL DEFAULT 'Unknown',
    "is_emergency" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "succession_successors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "critical_roles_tenant_id_idx" ON "critical_roles"("tenant_id");

-- CreateIndex
CREATE INDEX "succession_successors_tenant_id_idx" ON "succession_successors"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "succession_successors_critical_role_id_employee_id_key" ON "succession_successors"("critical_role_id", "employee_id");

-- AddForeignKey
ALTER TABLE "critical_roles" ADD CONSTRAINT "critical_roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critical_roles" ADD CONSTRAINT "critical_roles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critical_roles" ADD CONSTRAINT "critical_roles_incumbent_employee_id_fkey" FOREIGN KEY ("incumbent_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "succession_successors" ADD CONSTRAINT "succession_successors_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "succession_successors" ADD CONSTRAINT "succession_successors_critical_role_id_fkey" FOREIGN KEY ("critical_role_id") REFERENCES "critical_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "succession_successors" ADD CONSTRAINT "succession_successors_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "critical_roles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "critical_roles" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "critical_roles"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "succession_successors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "succession_successors" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "succession_successors"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
