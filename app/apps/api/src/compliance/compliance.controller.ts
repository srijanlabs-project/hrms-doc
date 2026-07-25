import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError } from "../platform/errors/errors";
import { ComplianceCalendarService } from "./compliance.service";
import { CompleteTaskDto } from "./dto/complete-task.dto";
import { CreateObligationDto } from "./dto/create-obligation.dto";
import { WaiveTaskDto } from "./dto/waive-task.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/10-statutory-and-compliance/05-compliance-calendar.md */
@Controller("compliance")
@Roles("org_admin", "hr_ops")
export class ComplianceController {
  constructor(
    private readonly service: ComplianceCalendarService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Post("obligations")
  @HttpCode(201)
  async createObligation(@Body() dto: CreateObligationDto) {
    const data = await this.service.createObligation(dto);
    return { data };
  }

  @Get("obligations")
  async listObligations() {
    const data = await this.service.listObligations();
    return { data };
  }

  @Get("tasks")
  async listTasks(@Query("status") status?: string) {
    const data = await this.service.listTasks(status);
    return { data };
  }

  @Post("tasks/:id/complete")
  @HttpCode(200)
  async complete(@Param("id") id: string, @Body() dto: CompleteTaskDto) {
    const data = await this.service.complete(id, dto);
    return { data };
  }

  @Post("tasks/:id/waive")
  @HttpCode(200)
  async waive(@Param("id") id: string, @Body() dto: WaiveTaskDto) {
    const data = await this.service.waive(id, dto.note);
    return { data };
  }

  @Post("generate-now")
  @HttpCode(200)
  async generateNow() {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    await this.service.runForTenant(tenantId);
    return { data: { triggered: true } };
  }
}
