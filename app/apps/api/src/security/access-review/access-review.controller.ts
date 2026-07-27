import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AccessReviewService } from "./access-review.service";
import { CreateAccessReviewCycleDto } from "./dto/create-access-review-cycle.dto";
import { RevokeAccessReviewItemDto } from "./dto/revoke-access-review-item.dto";

/** W0·E29 Security and Governance — periodic access certification. */
@Roles("org_admin", "hr_ops")
@Controller("security/access-reviews")
export class AccessReviewController {
  constructor(private readonly service: AccessReviewService) {}

  @Post()
  async start(@Body() dto: CreateAccessReviewCycleDto) {
    return { data: await this.service.startCycle(dto.periodLabel) };
  }

  @Get()
  async list() {
    return { data: await this.service.listCycles() };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return { data: await this.service.getCycle(id) };
  }

  @Post(":id/close")
  async close(@Param("id") id: string) {
    return { data: await this.service.closeCycle(id) };
  }

  @Post("items/:itemId/confirm")
  async confirmItem(@Param("itemId") itemId: string) {
    return { data: await this.service.confirmItem(itemId) };
  }

  @Post("items/:itemId/revoke")
  async revokeItem(@Param("itemId") itemId: string, @Body() dto: RevokeAccessReviewItemDto) {
    return { data: await this.service.revokeItem(itemId, dto.notes) };
  }
}
