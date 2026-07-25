import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateFinancialCenterDto } from "./dto/create-financial-center.dto";
import { FinancialCenterService } from "./financial-center.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/01-organization-management/06-cost-center-hierarchy.md */
@Controller("org/financial-centers")
export class FinancialCenterController {
  constructor(private readonly service: FinancialCenterService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateFinancialCenterDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
