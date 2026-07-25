import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ApplicationService } from "./application.service";
import { AdvanceApplicationDto } from "./dto/advance-application.dto";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { RejectApplicationDto } from "./dto/reject-application.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/06-recruitment-and-ats/05-screening.md (pipeline stage view). */
@Controller("recruitment/applications")
@Roles("org_admin", "hr_ops")
export class ApplicationController {
  constructor(private readonly service: ApplicationService) {}

  @Get()
  async listForRequisition(@Query("requisitionId") requisitionId: string) {
    const data = await this.service.listForRequisition(requisitionId);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async apply(@Body() dto: CreateApplicationDto) {
    const data = await this.service.apply(dto);
    return { data };
  }

  @Post(":id/advance")
  @HttpCode(200)
  async advance(@Param("id") id: string, @Body() dto: AdvanceApplicationDto) {
    const data = await this.service.advance(id, dto.stage);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: RejectApplicationDto) {
    const data = await this.service.reject(id, dto.reason);
    return { data };
  }
}
