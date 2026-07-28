import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ProposePayoutItemDto } from "./dto/propose-payout-item.dto";
import { RejectPayoutItemDto } from "./dto/reject-payout-item.dto";
import { PayoutItemService } from "./payout-item.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Wave 3 E14 gap closure: bonus planning + incentives. */
@Roles(...ADMIN_ROLES)
@Controller("compensation-planning/payout-items")
export class PayoutItemController {
  constructor(private readonly service: PayoutItemService) {}

  @Get()
  async listForCycle(@Query("cycleId") cycleId: string) {
    const data = await this.service.listForCycle(cycleId);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async propose(@Query("cycleId") cycleId: string, @Body() dto: ProposePayoutItemDto) {
    const data = await this.service.propose(cycleId, dto);
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: RejectPayoutItemDto) {
    const data = await this.service.reject(id, dto.decisionNote);
    return { data };
  }

  @Post(":id/post")
  @HttpCode(200)
  async post(@Param("id") id: string) {
    const data = await this.service.post(id);
    return { data };
  }
}
