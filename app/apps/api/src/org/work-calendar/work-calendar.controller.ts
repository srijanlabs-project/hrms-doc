import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AddCalendarDayDto } from "./dto/add-calendar-day.dto";
import { AssignCalendarDto } from "./dto/assign-calendar.dto";
import { CreateWorkCalendarDto } from "./dto/create-work-calendar.dto";
import { WorkCalendarService } from "./work-calendar.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/01-organization-management/09-work-calendar.md */
@Controller("org/work-calendars")
export class WorkCalendarController {
  constructor(private readonly service: WorkCalendarService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Get("assignments")
  async listAssignments() {
    const data = await this.service.listAssignments();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateWorkCalendarDto) {
    const data = await this.service.create(dto);
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
  @Post(":id/days")
  @HttpCode(201)
  async addDay(@Param("id") id: string, @Body() dto: AddCalendarDayDto) {
    const data = await this.service.addDay(id, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/assign")
  @HttpCode(201)
  async assign(@Param("id") id: string, @Body() dto: AssignCalendarDto) {
    const data = await this.service.assign(id, dto);
    return { data };
  }
}
