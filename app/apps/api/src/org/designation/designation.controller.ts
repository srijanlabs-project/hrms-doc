import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateDesignationDto } from "./dto/create-designation.dto";
import { DesignationService } from "./designation.service";

/** HTTP only — no business logic. Wave 1 Org Management deepening (designation + career track). */
@Controller("org/designations")
export class DesignationController {
  constructor(private readonly service: DesignationService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateDesignationDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
