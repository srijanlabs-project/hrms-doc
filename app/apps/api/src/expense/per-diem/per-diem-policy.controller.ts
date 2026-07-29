import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreatePerDiemPolicyDto } from "./dto/create-per-diem-policy.dto";
import { PerDiemService } from "./per-diem.service";

/** HTTP only — no business logic. Wave 3 W4·E17 gap closure ("per diem"). */
@Controller("expense/per-diem-policies")
export class PerDiemPolicyController {
  constructor(private readonly service: PerDiemService) {}

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePerDiemPolicyDto) {
    const data = await this.service.createPolicy(dto);
    return { data };
  }

  @Get()
  async listActive() {
    const data = await this.service.listActivePolicies();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAllAdmin() {
    const data = await this.service.listAllPoliciesAdmin();
    return { data };
  }
}
