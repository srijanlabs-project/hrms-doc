-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "alumni_contact_email" TEXT,
ADD COLUMN     "alumni_opt_in" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "contract_end_date" DATE,
ADD COLUMN     "designation_id" UUID;

-- CreateTable
CREATE TABLE "personal_details" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "marital_status" TEXT,
    "gender" TEXT,
    "blood_group" TEXT,
    "nationality" TEXT,
    "current_address_line" TEXT,
    "current_city" TEXT,
    "current_state" TEXT,
    "current_country" TEXT,
    "current_pincode" TEXT,
    "permanent_same_as_current" BOOLEAN NOT NULL DEFAULT true,
    "permanent_address_line" TEXT,
    "permanent_city" TEXT,
    "permanent_state" TEXT,
    "permanent_country" TEXT,
    "permanent_pincode" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "personal_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_documents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "issuing_country" TEXT,
    "expiry_date" DATE,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "identity_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "account_holder_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "ifsc_code" TEXT,
    "bank_name" TEXT NOT NULL,
    "branch_name" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_profiles" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "pan_number" TEXT,
    "tax_regime" TEXT,
    "tax_residency_country" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tax_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_documents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "document_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reference_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Uploaded',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "employee_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_certifications" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "issuing_organization" TEXT,
    "issue_date" DATE,
    "expiry_date" DATE,
    "credential_id" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_skills" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "skill_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "proficiency_level" TEXT NOT NULL DEFAULT 'Intermediate',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_records" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "field_of_study" TEXT,
    "start_year" INTEGER,
    "end_year" INTEGER,
    "grade" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "education_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prior_experiences" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "reason_for_leaving" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prior_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_assignment_histories" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "change_type" TEXT NOT NULL,
    "effective_date" DATE NOT NULL,
    "from_department_id" UUID,
    "to_department_id" UUID,
    "from_manager_id" UUID,
    "to_manager_id" UUID,
    "from_designation_id" UUID,
    "to_designation_id" UUID,
    "from_grade_id" UUID,
    "to_grade_id" UUID,
    "reason" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_assignment_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "probation_records" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "extended_until" DATE,
    "status" TEXT NOT NULL DEFAULT 'OnProbation',
    "decision_date" DATE,
    "decision_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "probation_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_revisions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "previous_monthly_basic" DOUBLE PRECISION NOT NULL,
    "proposed_monthly_basic" DOUBLE PRECISION NOT NULL,
    "effective_date" DATE NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Proposed',
    "decided_by_user_id" UUID,
    "decision_note" TEXT,
    "applied_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "salary_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_renewals" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "previous_end_date" DATE,
    "new_end_date" DATE NOT NULL,
    "note" TEXT,
    "renewed_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_renewals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personal_details_employee_id_key" ON "personal_details"("employee_id");

-- CreateIndex
CREATE INDEX "personal_details_tenant_id_idx" ON "personal_details"("tenant_id");

-- CreateIndex
CREATE INDEX "emergency_contacts_tenant_id_idx" ON "emergency_contacts"("tenant_id");

-- CreateIndex
CREATE INDEX "emergency_contacts_tenant_id_employee_id_idx" ON "emergency_contacts"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "identity_documents_tenant_id_idx" ON "identity_documents"("tenant_id");

-- CreateIndex
CREATE INDEX "identity_documents_tenant_id_employee_id_idx" ON "identity_documents"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "bank_accounts_tenant_id_idx" ON "bank_accounts"("tenant_id");

-- CreateIndex
CREATE INDEX "bank_accounts_tenant_id_employee_id_idx" ON "bank_accounts"("tenant_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "tax_profiles_employee_id_key" ON "tax_profiles"("employee_id");

-- CreateIndex
CREATE INDEX "tax_profiles_tenant_id_idx" ON "tax_profiles"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_documents_tenant_id_idx" ON "employee_documents"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_documents_tenant_id_employee_id_idx" ON "employee_documents"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "employee_certifications_tenant_id_idx" ON "employee_certifications"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_certifications_tenant_id_employee_id_idx" ON "employee_certifications"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "employee_skills_tenant_id_idx" ON "employee_skills"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_skills_tenant_id_employee_id_idx" ON "employee_skills"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "education_records_tenant_id_idx" ON "education_records"("tenant_id");

-- CreateIndex
CREATE INDEX "education_records_tenant_id_employee_id_idx" ON "education_records"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "prior_experiences_tenant_id_idx" ON "prior_experiences"("tenant_id");

-- CreateIndex
CREATE INDEX "prior_experiences_tenant_id_employee_id_idx" ON "prior_experiences"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "employee_assignment_histories_tenant_id_idx" ON "employee_assignment_histories"("tenant_id");

-- CreateIndex
CREATE INDEX "employee_assignment_histories_tenant_id_employee_id_idx" ON "employee_assignment_histories"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "probation_records_tenant_id_idx" ON "probation_records"("tenant_id");

-- CreateIndex
CREATE INDEX "probation_records_tenant_id_employee_id_idx" ON "probation_records"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "salary_revisions_tenant_id_idx" ON "salary_revisions"("tenant_id");

-- CreateIndex
CREATE INDEX "salary_revisions_tenant_id_employee_id_idx" ON "salary_revisions"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "contract_renewals_tenant_id_idx" ON "contract_renewals"("tenant_id");

-- CreateIndex
CREATE INDEX "contract_renewals_tenant_id_employee_id_idx" ON "contract_renewals"("tenant_id", "employee_id");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_designation_id_fkey" FOREIGN KEY ("designation_id") REFERENCES "designations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_details" ADD CONSTRAINT "personal_details_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_details" ADD CONSTRAINT "personal_details_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_documents" ADD CONSTRAINT "identity_documents_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_documents" ADD CONSTRAINT "identity_documents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_profiles" ADD CONSTRAINT "tax_profiles_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_profiles" ADD CONSTRAINT "tax_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_documents" ADD CONSTRAINT "employee_documents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_certifications" ADD CONSTRAINT "employee_certifications_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_certifications" ADD CONSTRAINT "employee_certifications_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_records" ADD CONSTRAINT "education_records_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "education_records" ADD CONSTRAINT "education_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prior_experiences" ADD CONSTRAINT "prior_experiences_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prior_experiences" ADD CONSTRAINT "prior_experiences_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_assignment_histories" ADD CONSTRAINT "employee_assignment_histories_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_assignment_histories" ADD CONSTRAINT "employee_assignment_histories_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "probation_records" ADD CONSTRAINT "probation_records_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "probation_records" ADD CONSTRAINT "probation_records_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_revisions" ADD CONSTRAINT "salary_revisions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_revisions" ADD CONSTRAINT "salary_revisions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_renewals" ADD CONSTRAINT "contract_renewals_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_renewals" ADD CONSTRAINT "contract_renewals_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Row Level Security ---------------------------------------------------------
-- Same pattern as every prior tenant-plane table: FORCE + NULLIF(...) so a
-- connection with no app.tenant_id set fails closed to zero rows (see
-- migration 20260719190000_fix_tenant_isolation_empty_guc).

ALTER TABLE "personal_details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "personal_details" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "personal_details"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "emergency_contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "emergency_contacts" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "emergency_contacts"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "identity_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "identity_documents" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "identity_documents"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "bank_accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bank_accounts" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "bank_accounts"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "tax_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tax_profiles" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "tax_profiles"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employee_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_documents" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "employee_documents"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employee_certifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_certifications" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "employee_certifications"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employee_skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_skills" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "employee_skills"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "education_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "education_records" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "education_records"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "prior_experiences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prior_experiences" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "prior_experiences"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "employee_assignment_histories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_assignment_histories" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "employee_assignment_histories"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "probation_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "probation_records" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "probation_records"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "salary_revisions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "salary_revisions" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "salary_revisions"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "contract_renewals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contract_renewals" FORCE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation" ON "contract_renewals"
    USING ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK ("tenant_id" = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
