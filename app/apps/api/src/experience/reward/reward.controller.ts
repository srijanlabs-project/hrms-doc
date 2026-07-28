import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateRewardItemDto } from "./dto/create-reward-item.dto";
import { DecideRedemptionDto } from "./dto/decide-redemption.dto";
import { RewardService } from "./reward.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Wave 4 W4·E15 gap closure: rewards. */
@Controller("experience/rewards")
export class RewardController {
  constructor(private readonly service: RewardService) {}

  @Get("catalog")
  async listCatalogActive() {
    const data = await this.service.listCatalogActive();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("catalog/admin")
  async listCatalogAllAdmin() {
    const data = await this.service.listCatalogAllAdmin();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("catalog")
  @HttpCode(201)
  async createCatalogItem(@Body() dto: CreateRewardItemDto) {
    const data = await this.service.createCatalogItem(dto);
    return { data };
  }

  @Get("balance")
  async myBalance() {
    const data = await this.service.myBalance();
    return { data };
  }

  @Post("redemptions/:rewardItemId")
  @HttpCode(201)
  async redeem(@Param("rewardItemId") rewardItemId: string) {
    const data = await this.service.redeem(rewardItemId);
    return { data };
  }

  @Get("redemptions/mine")
  async listMyRedemptions() {
    const data = await this.service.listMyRedemptions();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("redemptions")
  async listAllRedemptionsAdmin() {
    const data = await this.service.listAllRedemptionsAdmin();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("redemptions/:id/fulfill")
  @HttpCode(200)
  async fulfill(@Param("id") id: string, @Body() dto: DecideRedemptionDto) {
    const data = await this.service.fulfill(id, dto.decisionNote);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("redemptions/:id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string, @Body() dto: DecideRedemptionDto) {
    const data = await this.service.cancel(id, dto.decisionNote);
    return { data };
  }
}
