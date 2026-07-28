-- CreateTable
CREATE TABLE "reward_catalog_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "points_cost" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "reward_catalog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_redemptions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "reward_item_id" UUID NOT NULL,
    "points_spent" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Requested',
    "decision_note" TEXT,
    "fulfilled_at" TIMESTAMPTZ(6),
    "cancelled_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communities" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'General',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_memberships" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "community_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_posts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "community_id" UUID,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_comments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_likes" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_events" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "start_at" TIMESTAMPTZ(6) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "experience_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_rsvps" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "response" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_comments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "announcement_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wellness_programs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "created_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "wellness_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wellness_enrollments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "enrolled_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wellness_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reward_catalog_items_tenant_id_idx" ON "reward_catalog_items"("tenant_id");

-- CreateIndex
CREATE INDEX "reward_redemptions_tenant_id_idx" ON "reward_redemptions"("tenant_id");

-- CreateIndex
CREATE INDEX "reward_redemptions_tenant_id_employee_id_idx" ON "reward_redemptions"("tenant_id", "employee_id");

-- CreateIndex
CREATE INDEX "communities_tenant_id_idx" ON "communities"("tenant_id");

-- CreateIndex
CREATE INDEX "community_memberships_tenant_id_idx" ON "community_memberships"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "community_memberships_tenant_id_community_id_employee_id_key" ON "community_memberships"("tenant_id", "community_id", "employee_id");

-- CreateIndex
CREATE INDEX "feed_posts_tenant_id_created_at_idx" ON "feed_posts"("tenant_id", "created_at");

-- CreateIndex
CREATE INDEX "feed_posts_tenant_id_community_id_idx" ON "feed_posts"("tenant_id", "community_id");

-- CreateIndex
CREATE INDEX "feed_comments_tenant_id_post_id_idx" ON "feed_comments"("tenant_id", "post_id");

-- CreateIndex
CREATE INDEX "feed_likes_tenant_id_post_id_idx" ON "feed_likes"("tenant_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "feed_likes_tenant_id_post_id_employee_id_key" ON "feed_likes"("tenant_id", "post_id", "employee_id");

-- CreateIndex
CREATE INDEX "experience_events_tenant_id_start_at_idx" ON "experience_events"("tenant_id", "start_at");

-- CreateIndex
CREATE INDEX "event_rsvps_tenant_id_event_id_idx" ON "event_rsvps"("tenant_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_rsvps_tenant_id_event_id_employee_id_key" ON "event_rsvps"("tenant_id", "event_id", "employee_id");

-- CreateIndex
CREATE INDEX "announcement_comments_tenant_id_announcement_id_idx" ON "announcement_comments"("tenant_id", "announcement_id");

-- CreateIndex
CREATE INDEX "wellness_programs_tenant_id_idx" ON "wellness_programs"("tenant_id");

-- CreateIndex
CREATE INDEX "wellness_enrollments_tenant_id_program_id_idx" ON "wellness_enrollments"("tenant_id", "program_id");

-- CreateIndex
CREATE UNIQUE INDEX "wellness_enrollments_tenant_id_program_id_employee_id_key" ON "wellness_enrollments"("tenant_id", "program_id", "employee_id");

-- AddForeignKey
ALTER TABLE "reward_catalog_items" ADD CONSTRAINT "reward_catalog_items_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_reward_item_id_fkey" FOREIGN KEY ("reward_item_id") REFERENCES "reward_catalog_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_memberships" ADD CONSTRAINT "community_memberships_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_posts" ADD CONSTRAINT "feed_posts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_posts" ADD CONSTRAINT "feed_posts_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_posts" ADD CONSTRAINT "feed_posts_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_comments" ADD CONSTRAINT "feed_comments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_likes" ADD CONSTRAINT "feed_likes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_likes" ADD CONSTRAINT "feed_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_likes" ADD CONSTRAINT "feed_likes_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_events" ADD CONSTRAINT "experience_events_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "experience_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_comments" ADD CONSTRAINT "announcement_comments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_comments" ADD CONSTRAINT "announcement_comments_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_comments" ADD CONSTRAINT "announcement_comments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wellness_programs" ADD CONSTRAINT "wellness_programs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wellness_enrollments" ADD CONSTRAINT "wellness_enrollments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wellness_enrollments" ADD CONSTRAINT "wellness_enrollments_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "wellness_programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wellness_enrollments" ADD CONSTRAINT "wellness_enrollments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security (hand-appended, see docs/07-appendices/24)
ALTER TABLE "reward_catalog_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reward_catalog_items" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "reward_catalog_items";
CREATE POLICY tenant_isolation ON "reward_catalog_items"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "reward_redemptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reward_redemptions" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "reward_redemptions";
CREATE POLICY tenant_isolation ON "reward_redemptions"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "communities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "communities" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "communities";
CREATE POLICY tenant_isolation ON "communities"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "community_memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "community_memberships" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "community_memberships";
CREATE POLICY tenant_isolation ON "community_memberships"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "feed_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feed_posts" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "feed_posts";
CREATE POLICY tenant_isolation ON "feed_posts"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "feed_comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feed_comments" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "feed_comments";
CREATE POLICY tenant_isolation ON "feed_comments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "feed_likes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feed_likes" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "feed_likes";
CREATE POLICY tenant_isolation ON "feed_likes"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "experience_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "experience_events" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "experience_events";
CREATE POLICY tenant_isolation ON "experience_events"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "event_rsvps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_rsvps" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "event_rsvps";
CREATE POLICY tenant_isolation ON "event_rsvps"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "announcement_comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "announcement_comments" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "announcement_comments";
CREATE POLICY tenant_isolation ON "announcement_comments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "wellness_programs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wellness_programs" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "wellness_programs";
CREATE POLICY tenant_isolation ON "wellness_programs"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

ALTER TABLE "wellness_enrollments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "wellness_enrollments" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "wellness_enrollments";
CREATE POLICY tenant_isolation ON "wellness_enrollments"
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
