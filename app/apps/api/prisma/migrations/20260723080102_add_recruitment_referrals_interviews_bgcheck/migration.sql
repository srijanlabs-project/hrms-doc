-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "referred_by_employee_id" UUID;

-- CreateTable
CREATE TABLE "interview_rounds" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "round_number" INTEGER NOT NULL,
    "interviewer_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6) NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'Video',
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "interview_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_feedback" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "interview_round_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "recommendation" TEXT NOT NULL,
    "comments" TEXT,
    "submitted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "background_checks" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "offer_id" UUID NOT NULL,
    "check_type" TEXT NOT NULL DEFAULT 'Comprehensive',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "remarks" TEXT,
    "initiated_by_user_id" UUID NOT NULL,
    "initiated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "background_checks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interview_rounds_tenant_id_idx" ON "interview_rounds"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_rounds_application_id_round_number_key" ON "interview_rounds"("application_id", "round_number");

-- CreateIndex
CREATE UNIQUE INDEX "interview_feedback_interview_round_id_key" ON "interview_feedback"("interview_round_id");

-- CreateIndex
CREATE INDEX "interview_feedback_tenant_id_idx" ON "interview_feedback"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "background_checks_offer_id_key" ON "background_checks"("offer_id");

-- CreateIndex
CREATE INDEX "background_checks_tenant_id_idx" ON "background_checks"("tenant_id");

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_referred_by_employee_id_fkey" FOREIGN KEY ("referred_by_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_rounds" ADD CONSTRAINT "interview_rounds_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_rounds" ADD CONSTRAINT "interview_rounds_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_rounds" ADD CONSTRAINT "interview_rounds_interviewer_id_fkey" FOREIGN KEY ("interviewer_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_feedback" ADD CONSTRAINT "interview_feedback_interview_round_id_fkey" FOREIGN KEY ("interview_round_id") REFERENCES "interview_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_checks" ADD CONSTRAINT "background_checks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "background_checks" ADD CONSTRAINT "background_checks_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RowLevelSecurity
ALTER TABLE "interview_rounds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "interview_rounds" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "interview_rounds"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "interview_feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "interview_feedback" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "interview_feedback"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "background_checks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "background_checks" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "background_checks"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
