import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateSlaPolicyDto } from "./dto/create-sla-policy.dto";
import { SlaPolicyService } from "./sla-policy.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/19-helpdesk-case-management.md */
@Roles("org_admin", "hr_ops")
@Controller("helpdesk/sla-policies")
export class SlaPolicyController {
  constructor(private readonly service: SlaPolicyService) {}

  @Post()
  @HttpCode(201)
  async upsert(@Body() dto: CreateSlaPolicyDto) {
    const data = await this.service.upsert(dto);
    return { data };
  }

  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }
}
