-- AlterTable
ALTER TABLE "appraisals" ADD COLUMN     "calibrated_rating" INTEGER,
ADD COLUMN     "calibration_session_id" UUID;

-- CreateTable
CREATE TABLE "feedback_campaigns" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "subject_employee_id" UUID NOT NULL,
    "cycle_year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_by_user_id" UUID NOT NULL,
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "feedback_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_raters" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "campaign_id" UUID NOT NULL,
    "rater_employee_id" UUID NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Peer',
    "status" TEXT NOT NULL DEFAULT 'Invited',
    "rating" INTEGER,
    "strengths" TEXT,
    "development_areas" TEXT,
    "submitted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_raters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calibration_sessions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "period_year" INTEGER NOT NULL,
    "cohort_label" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_by_user_id" UUID NOT NULL,
    "closed_by_user_id" UUID,
    "closed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "calibration_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calibration_cases" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "appraisal_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "originalRating" INTEGER NOT NULL,
    "calibrated_rating" INTEGER,
    "rationale" TEXT,
    "decided_by_user_id" UUID,
    "decided_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calibration_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_campaigns_tenant_id_idx" ON "feedback_campaigns"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_campaigns_tenant_id_subject_employee_id_cycle_year_key" ON "feedback_campaigns"("tenant_id", "subject_employee_id", "cycle_year");

-- CreateIndex
CREATE INDEX "feedback_raters_tenant_id_idx" ON "feedback_raters"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_raters_campaign_id_rater_employee_id_key" ON "feedback_raters"("campaign_id", "rater_employee_id");

-- CreateIndex
CREATE INDEX "calibration_sessions_tenant_id_idx" ON "calibration_sessions"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "calibration_sessions_tenant_id_period_year_cohort_label_key" ON "calibration_sessions"("tenant_id", "period_year", "cohort_label");

-- CreateIndex
CREATE UNIQUE INDEX "calibration_cases_appraisal_id_key" ON "calibration_cases"("appraisal_id");

-- CreateIndex
CREATE INDEX "calibration_cases_tenant_id_idx" ON "calibration_cases"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "calibration_cases_session_id_appraisal_id_key" ON "calibration_cases"("session_id", "appraisal_id");

-- AddForeignKey
ALTER TABLE "appraisals" ADD CONSTRAINT "appraisals_calibration_session_id_fkey" FOREIGN KEY ("calibration_session_id") REFERENCES "calibration_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_campaigns" ADD CONSTRAINT "feedback_campaigns_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_campaigns" ADD CONSTRAINT "feedback_campaigns_subject_employee_id_fkey" FOREIGN KEY ("subject_employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_raters" ADD CONSTRAINT "feedback_raters_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_raters" ADD CONSTRAINT "feedback_raters_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "feedback_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_raters" ADD CONSTRAINT "feedback_raters_rater_employee_id_fkey" FOREIGN KEY ("rater_employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calibration_sessions" ADD CONSTRAINT "calibration_sessions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calibration_cases" ADD CONSTRAINT "calibration_cases_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calibration_cases" ADD CONSTRAINT "calibration_cases_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "calibration_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calibration_cases" ADD CONSTRAINT "calibration_cases_appraisal_id_fkey" FOREIGN KEY ("appraisal_id") REFERENCES "appraisals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calibration_cases" ADD CONSTRAINT "calibration_cases_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "feedback_campaigns" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feedback_campaigns" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "feedback_campaigns"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "feedback_raters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feedback_raters" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "feedback_raters"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "calibration_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "calibration_sessions" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "calibration_sessions"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "calibration_cases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "calibration_cases" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "calibration_cases"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
