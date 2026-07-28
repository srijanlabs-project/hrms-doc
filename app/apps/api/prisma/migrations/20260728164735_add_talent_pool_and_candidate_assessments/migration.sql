-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "candidate_assessments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "candidate_id" UUID NOT NULL,
    "application_id" UUID,
    "type" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "max_score" DOUBLE PRECISION,
    "notes" TEXT,
    "administered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "administered_by_user_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "candidate_assessments_tenant_id_idx" ON "candidate_assessments"("tenant_id");

-- CreateIndex
CREATE INDEX "candidate_assessments_tenant_id_candidate_id_idx" ON "candidate_assessments"("tenant_id", "candidate_id");

-- AddForeignKey
ALTER TABLE "candidate_assessments" ADD CONSTRAINT "candidate_assessments_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_assessments" ADD CONSTRAINT "candidate_assessments_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_assessments" ADD CONSTRAINT "candidate_assessments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Row-Level Security
ALTER TABLE "candidate_assessments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "candidate_assessments" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "candidate_assessments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
