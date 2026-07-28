import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PeopleModule } from "../people/people.module";
import { AnnouncementController } from "./announcement/announcement.controller";
import { AnnouncementRepository } from "./announcement/announcement.repository";
import { AnnouncementService } from "./announcement/announcement.service";
import { AnnouncementCommentController } from "./comment/announcement-comment.controller";
import { AnnouncementCommentRepository } from "./comment/announcement-comment.repository";
import { AnnouncementCommentService } from "./comment/announcement-comment.service";

/**
 * Communication Platform, Wave 4 W4·E23 —
 * docs/03-module-specifications/23-communication-platform.md. v1 slice:
 * Announcement, collapsing announcements/news/bulletin-board/campaigns into
 * one type-tagged entity with a Draft/Published/Archived lifecycle — a real
 * catalog-gap fill that replaces the hardcoded home-dashboard Announcements
 * widget. Deepened per Wave 3 E15 gap closure ("employee communications")
 * with employee comments on announcements — a real two-way engagement layer,
 * not a duplicate broadcast mechanism. Email/SMS/push/WhatsApp/Slack/Teams
 * all stay deferred — no real external gateway exists in this build.
 */
@Module({
  imports: [AuthModule, PeopleModule],
  controllers: [AnnouncementController, AnnouncementCommentController],
  providers: [AnnouncementService, AnnouncementRepository, AnnouncementCommentService, AnnouncementCommentRepository],
})
export class CommunicationModule {}
