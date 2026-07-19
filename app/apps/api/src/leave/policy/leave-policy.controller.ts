import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateLeavePolicyDto } from "./dto/create-leave-policy.dto";
import { LeavePolicyService } from "./leave-policy.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/08-leave-management/01-leave-policies.md */
@Controller("leave/policies")
export class LeavePolicyController {
  constructor(private readonly service: LeavePolicyService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLeavePolicyDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
