import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateJobFunctionDto } from "./dto/create-job-function.dto";
import { JobFunctionService } from "./job-function.service";

/** HTTP only — no business logic. Wave 1 Org Management deepening (job function catalog). */
@Controller("org/job-functions")
export class JobFunctionController {
  constructor(private readonly service: JobFunctionService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateJobFunctionDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
