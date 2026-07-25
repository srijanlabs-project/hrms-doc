import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AnnouncementController } from "./announcement/announcement.controller";
import { AnnouncementRepository } from "./announcement/announcement.repository";
import { AnnouncementService } from "./announcement/announcement.service";

/**
 * Communication Platform, Wave 4 W4·E23 —
 * docs/03-module-specifications/23-communication-platform.md. v1 slice:
 * Announcement, collapsing announcements/news/bulletin-board/campaigns into
 * one type-tagged entity with a Draft/Published/Archived lifecycle — a real
 * catalog-gap fill that replaces the hardcoded home-dashboard Announcements
 * widget. Email/SMS/push/WhatsApp/Slack/Teams all stay deferred — no real
 * external gateway exists in this build.
 */
@Module({
  imports: [AuthModule],
  controllers: [AnnouncementController],
  providers: [AnnouncementService, AnnouncementRepository],
})
export class CommunicationModule {}
