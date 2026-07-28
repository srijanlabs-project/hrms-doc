import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateAnnouncementCommentDto } from "./dto/create-announcement-comment.dto";
import { AnnouncementCommentService } from "./announcement-comment.service";

/** HTTP only — no business logic. Wave 4 W4·E15 gap closure: employee communications. */
@Controller("communications/announcements/:announcementId/comments")
export class AnnouncementCommentController {
  constructor(private readonly service: AnnouncementCommentService) {}

  @Get()
  async listForAnnouncement(@Param("announcementId") announcementId: string) {
    const data = await this.service.listForAnnouncement(announcementId);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Param("announcementId") announcementId: string, @Body() dto: CreateAnnouncementCommentDto) {
    const data = await this.service.create(announcementId, dto);
    return { data };
  }
}
