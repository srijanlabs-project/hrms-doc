import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateOrgUnitDto } from "./dto/create-org-unit.dto";
import { OrgUnitService } from "./org-unit.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/01-organization-management/04-organization-tree.md */
@Controller("org/org-units")
export class OrgUnitController {
  constructor(private readonly service: OrgUnitService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateOrgUnitDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
