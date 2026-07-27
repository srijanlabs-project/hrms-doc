import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { SubmitInternalApplicationDto } from "./dto/submit-internal-application.dto";
import { InternalMobilityService } from "./internal-mobility.service";

/**
 * HTTP only — no business logic. Self-service: any authenticated employee
 * may browse and apply to internal openings, unlike the rest of Recruitment
 * which is org_admin/hr_ops only (no @Roles decorator here — AuthGuard
 * alone gates this to "signed in").
 */
@Controller("recruitment/internal-mobility")
export class InternalMobilityController {
  constructor(private readonly service: InternalMobilityService) {}

  @Get("openings")
  async openings() {
    const data = await this.service.listOpenings();
    return { data };
  }

  @Get("mine")
  async mine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async apply(@Body() dto: SubmitInternalApplicationDto) {
    const data = await this.service.apply(dto);
    return { data };
  }
}
