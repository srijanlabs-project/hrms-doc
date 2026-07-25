import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateReportingLineDto } from "./dto/create-reporting-line.dto";
import { ReportingLineService } from "./reporting-line.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/01-organization-management/05-reporting-structure.md */
@Roles("org_admin", "hr_ops")
@Controller("org/reporting-lines")
export class ReportingLineController {
  constructor(private readonly service: ReportingLineService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateReportingLineDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/end")
  @HttpCode(200)
  async end(@Param("id") id: string) {
    const data = await this.service.end(id);
    return { data };
  }
}
