import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateJobFamilyDto } from "./dto/create-job-family.dto";
import { JobFamilyService } from "./job-family.service";

/** HTTP only — no business logic. Wave 1 Org Management deepening (job family catalog). */
@Controller("org/job-families")
export class JobFamilyController {
  constructor(private readonly service: JobFamilyService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateJobFamilyDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
