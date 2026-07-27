import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { RequestContextService } from "../context/request-context.service";
import { AuthenticationAppError } from "../errors/errors";
import { UpdateNumberSeriesDto } from "./dto/update-number-series.dto";
import { NumberSeriesService } from "./number-series.service";

/** Admin-facing viewer for the Number Series engine. HTTP only — no business logic. */
@Roles("org_admin", "hr_ops")
@Controller("number-series")
export class NumberSeriesController {
  constructor(
    private readonly service: NumberSeriesService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Get()
  async list() {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    const data = await this.service.listAll(tenantId);
    return { data };
  }

  @Patch(":id")
  async updateConfig(@Param("id") id: string, @Body() dto: UpdateNumberSeriesDto) {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    const data = await this.service.updateConfig(tenantId, id, dto);
    return { data };
  }
}
