import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateHealthRecordDto } from "./dto/create-health-record.dto";
import { HealthRecordService } from "./health-record.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/22-health-safety-wellness.md */
@Controller("health-safety/health-records")
export class HealthRecordController {
  constructor(private readonly service: HealthRecordService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateHealthRecordDto) {
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
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }
}
