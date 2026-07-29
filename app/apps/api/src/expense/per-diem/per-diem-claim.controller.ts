import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { DecidePerDiemClaimDto } from "./dto/decide-per-diem-claim.dto";
import { SubmitPerDiemClaimDto } from "./dto/submit-per-diem-claim.dto";
import { PerDiemService } from "./per-diem.service";

/** HTTP only — no business logic. Wave 3 W4·E17 gap closure ("per diem"). */
@Controller("expense/per-diem-claims")
export class PerDiemClaimController {
  constructor(private readonly service: PerDiemService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: SubmitPerDiemClaimDto) {
    const data = await this.service.submitClaim(dto);
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
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string, @Body() dto: DecidePerDiemClaimDto) {
    const data = await this.service.decide(id, "Approved", dto.note);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: DecidePerDiemClaimDto) {
    const data = await this.service.decide(id, "Rejected", dto.note);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/mark-paid")
  @HttpCode(200)
  async markPaid(@Param("id") id: string) {
    const data = await this.service.markPaid(id);
    return { data };
  }
}
