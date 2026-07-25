import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateGradeDto } from "./dto/create-grade.dto";
import { GradeService } from "./grade.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/01-organization-management/07-grade-and-band.md */
@Controller("org/grades")
export class GradeController {
  constructor(private readonly service: GradeService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateGradeDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
