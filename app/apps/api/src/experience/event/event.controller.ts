import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateEventDto } from "./dto/create-event.dto";
import { RsvpEventDto } from "./dto/rsvp-event.dto";
import { EventService } from "./event.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Wave 4 W4·E15 gap closure: events. */
@Controller("experience/events")
export class EventController {
  constructor(private readonly service: EventService) {}

  @Get()
  async listPublishedUpcoming() {
    const data = await this.service.listPublishedUpcoming();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("admin")
  async listAllAdmin() {
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateEventDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post(":id/publish")
  @HttpCode(200)
  async publish(@Param("id") id: string) {
    const data = await this.service.publish(id);
    return { data };
  }

  @Post(":id/rsvp")
  @HttpCode(200)
  async rsvp(@Param("id") id: string, @Body() dto: RsvpEventDto) {
    const data = await this.service.rsvp(id, dto);
    return { data };
  }

  @Get(":id/rsvp/mine")
  async myRsvp(@Param("id") id: string) {
    const data = await this.service.myRsvp(id);
    return { data };
  }
}
