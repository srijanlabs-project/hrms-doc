import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateOrgPolicyDto } from "./dto/create-org-policy.dto";
import { OrgPolicyService } from "./org-policy.service";

/** HTTP only — no business logic. Wave 1 Org Management deepening (organization policies — no dedicated spec). */
@Controller("org/policies")
export class OrgPolicyController {
  constructor(private readonly service: OrgPolicyService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateOrgPolicyDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/archive")
  @HttpCode(200)
  async archive(@Param("id") id: string) {
    const data = await this.service.archive(id);
    return { data };
  }
}
