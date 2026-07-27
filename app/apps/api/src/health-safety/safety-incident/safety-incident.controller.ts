import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateSafetyIncidentDto } from "./dto/create-safety-incident.dto";
import { ReviewSafetyIncidentDto } from "./dto/review-safety-incident.dto";
import { SafetyIncidentService } from "./safety-incident.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/22-health-safety-wellness.md */
@Controller("health-safety/incidents")
export class SafetyIncidentController {
  constructor(private readonly service: SafetyIncidentService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateSafetyIncidentDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get()
  @Roles("org_admin", "hr_ops")
  async listAll(@Query("status") status?: string) {
    const data = await this.service.listAll(status);
    return { data };
  }

  @Post(":id/review")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async review(@Param("id") id: string, @Body() dto: ReviewSafetyIncidentDto) {
    const data = await this.service.review(id, dto);
    return { data };
  }

  @Post(":id/resolve")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async resolve(@Param("id") id: string) {
    const data = await this.service.resolve(id);
    return { data };
  }

  @Post(":id/close")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async close(@Param("id") id: string) {
    const data = await this.service.close(id);
    return { data };
  }
}
