import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateOvertimeRequestDto } from "./dto/create-overtime-request.dto";
import { DecideOvertimeRequestDto } from "./dto/decide-overtime-request.dto";
import { OvertimeService } from "./overtime.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/07-workforce-management/06-overtime.md */
@Controller("workforce/overtime")
export class OvertimeController {
  constructor(private readonly service: OvertimeService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateOvertimeRequestDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("team")
  async listForApproval() {
    const data = await this.service.listForApproval();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string, @Body() dto: DecideOvertimeRequestDto) {
    const data = await this.service.decide(id, "Approved", dto.note);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: DecideOvertimeRequestDto) {
    const data = await this.service.decide(id, "Rejected", dto.note);
    return { data };
  }
}
