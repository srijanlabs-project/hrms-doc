import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { DecideSwapDto } from "./dto/decide-swap.dto";
import { PublishRosterDto } from "./dto/publish-roster.dto";
import { RequestSwapDto } from "./dto/request-swap.dto";
import { UpsertRosterEntryDto } from "./dto/upsert-roster-entry.dto";
import { RosterService } from "./roster.service";

/** HTTP only — no business logic. Spec: 08-.../07-workforce-management/{04-rostering,07-workforce-scheduling}.md */
@Controller("workforce/roster")
export class RosterController {
  constructor(private readonly service: RosterService) {}

  @Roles("org_admin", "hr_ops")
  @Post("entries")
  @HttpCode(201)
  async upsertEntry(@Body() dto: UpsertRosterEntryDto) {
    const data = await this.service.upsertEntry(dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("entries")
  async listForRange(@Query("from") from: string, @Query("to") to: string) {
    const data = await this.service.listForRange(from, to);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("publish")
  @HttpCode(200)
  async publish(@Body() dto: PublishRosterDto) {
    const data = await this.service.publish(dto.from, dto.to);
    return { data };
  }

  @Get("mine")
  async myRoster(@Query("from") from: string, @Query("to") to: string) {
    const data = await this.service.myRoster(from, to);
    return { data };
  }

  @Post("entries/:id/swap-requests")
  @HttpCode(201)
  async requestSwap(@Param("id") id: string, @Body() dto: RequestSwapDto) {
    const data = await this.service.requestSwap(id, dto);
    return { data };
  }

  @Get("swap-requests/mine")
  async listMySwaps() {
    const data = await this.service.listMySwaps();
    return { data };
  }

  @Get("swap-requests/team")
  async listSwapsForApproval() {
    const data = await this.service.listSwapsForApproval();
    return { data };
  }

  @Post("swap-requests/:id/approve")
  @HttpCode(200)
  async approveSwap(@Param("id") id: string, @Body() dto: DecideSwapDto) {
    const data = await this.service.decideSwap(id, "Approved", dto.note);
    return { data };
  }

  @Post("swap-requests/:id/reject")
  @HttpCode(200)
  async rejectSwap(@Param("id") id: string, @Body() dto: DecideSwapDto) {
    const data = await this.service.decideSwap(id, "Rejected", dto.note);
    return { data };
  }

  @Post("swap-requests/:id/withdraw")
  @HttpCode(200)
  async withdrawSwap(@Param("id") id: string) {
    await this.service.withdrawSwap(id);
    return { data: { withdrawn: true } };
  }
}
