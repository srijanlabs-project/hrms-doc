import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { CreateLeaveRequestDto } from "./dto/create-leave-request.dto";
import { DecideLeaveRequestDto } from "./dto/decide-leave-request.dto";
import { LeaveRequestService } from "./leave-request.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/08-leave-management/03-leave-approval.md */
@Controller("leave/requests")
export class LeaveRequestController {
  constructor(private readonly service: LeaveRequestService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLeaveRequestDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("team")
  async listForApproval(@Query("status") status?: string) {
    const data = await this.service.listForApproval(status);
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string, @Body() dto: DecideLeaveRequestDto) {
    const data = await this.service.decide(id, "Approved", dto.note);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: DecideLeaveRequestDto) {
    const data = await this.service.decide(id, "Rejected", dto.note);
    return { data };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    await this.service.cancel(id);
    return { data: { cancelled: true } };
  }
}
