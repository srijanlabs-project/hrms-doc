import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateVisitorDto } from "./dto/create-visitor.dto";
import { VisitorService } from "./visitor.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/21-visitor-workplace-management.md */
@Controller("workplace/visitors")
export class VisitorController {
  constructor(private readonly service: VisitorService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateVisitorDto) {
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

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    const data = await this.service.cancel(id);
    return { data };
  }

  @Post(":id/check-in")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async checkIn(@Param("id") id: string) {
    const data = await this.service.checkIn(id);
    return { data };
  }

  @Post(":id/check-out")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async checkOut(@Param("id") id: string) {
    const data = await this.service.checkOut(id);
    return { data };
  }

  @Post("expiry-sweep/run-now")
  @HttpCode(200)
  async runExpirySweepNow() {
    await this.service.runExpirySweepNow();
    return { data: { triggered: true } };
  }
}
