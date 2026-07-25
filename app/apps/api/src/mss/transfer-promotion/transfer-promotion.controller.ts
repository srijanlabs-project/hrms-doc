import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateTransferPromotionRequestDto } from "./dto/create-request.dto";
import { RejectTransferPromotionRequestDto } from "./dto/reject-request.dto";
import { TransferPromotionService } from "./transfer-promotion.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/05-manager-self-service.md */
@Controller("mss/transfer-promotion")
export class TransferPromotionController {
  constructor(private readonly service: TransferPromotionService) {}

  @Post()
  @HttpCode(201)
  async propose(@Body() dto: CreateTransferPromotionRequestDto) {
    const data = await this.service.propose(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAllAdmin(@Query("status") status?: string) {
    const data = await this.service.listAllAdmin(status);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: RejectTransferPromotionRequestDto) {
    const data = await this.service.reject(id, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/apply")
  @HttpCode(200)
  async apply(@Param("id") id: string) {
    const data = await this.service.apply(id);
    return { data };
  }
}
