import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreatePayoutCycleDto } from "./dto/create-payout-cycle.dto";
import { PayoutCycleService } from "./payout-cycle.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Wave 3 E14 gap closure: bonus planning + incentives. */
@Roles(...ADMIN_ROLES)
@Controller("compensation-planning/payout-cycles")
export class PayoutCycleController {
  constructor(private readonly service: PayoutCycleService) {}

  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePayoutCycleDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/close")
  @HttpCode(200)
  async close(@Param("id") id: string) {
    const data = await this.service.close(id);
    return { data };
  }
}
