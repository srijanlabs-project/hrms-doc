import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateIncentiveBonusDto } from "./dto/create-incentive-bonus.dto";
import { IncentiveBonusService } from "./incentive-bonus.service";

/** HTTP only — no business logic. Payroll (E09) incentives, bonus, and variable pay. */
@Controller("payroll/incentive-bonus")
export class IncentiveBonusController {
  constructor(private readonly service: IncentiveBonusService) {}

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateIncentiveBonusDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }
}
