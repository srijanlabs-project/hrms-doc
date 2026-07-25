import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AssignFlexPolicyDto } from "./dto/assign-flex-policy.dto";
import { CreateFlexPolicyDto } from "./dto/create-flex-policy.dto";
import { FlexService } from "./flex.service";

/** HTTP only — no business logic. Workforce Management (E07) flexible hours. */
@Controller("workforce/flex")
export class FlexController {
  constructor(private readonly service: FlexService) {}

  @Roles("org_admin", "hr_ops")
  @Post("policies")
  @HttpCode(201)
  async createPolicy(@Body() dto: CreateFlexPolicyDto) {
    const data = await this.service.createPolicy(dto);
    return { data };
  }

  @Get("policies")
  async listPolicies() {
    const data = await this.service.listPolicies();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("assign")
  @HttpCode(200)
  async assign(@Body() dto: AssignFlexPolicyDto) {
    const data = await this.service.assign(dto);
    return { data };
  }

  @Get("mine")
  async myPolicy() {
    const data = await this.service.myPolicy();
    return { data };
  }
}
