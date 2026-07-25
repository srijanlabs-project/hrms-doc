import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AnnouncementService } from "./announcement.service";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/23-communication-platform.md */
@Controller("communications/announcements")
export class AnnouncementController {
  constructor(private readonly service: AnnouncementService) {}

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateAnnouncementDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get()
  async listPublished() {
    const data = await this.service.listPublished();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("admin")
  async listAllAdmin() {
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/publish")
  @HttpCode(200)
  async publish(@Param("id") id: string) {
    const data = await this.service.publish(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/archive")
  @HttpCode(200)
  async archive(@Param("id") id: string) {
    const data = await this.service.archive(id);
    return { data };
  }
}
