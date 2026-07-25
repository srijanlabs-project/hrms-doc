import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { SubmitReferralDto } from "./dto/submit-referral.dto";
import { ReferralService } from "./referral.service";

/**
 * HTTP only — no business logic. Self-service: any authenticated employee
 * may refer a candidate, unlike the rest of Recruitment which is
 * org_admin/hr_ops only (no @Roles decorator here — AuthGuard alone gates
 * this to "signed in").
 */
@Controller("recruitment/referrals")
export class ReferralController {
  constructor(private readonly service: ReferralService) {}

  @Get("open-requisitions")
  async openRequisitions() {
    const data = await this.service.listOpenRequisitions();
    return { data };
  }

  @Get("mine")
  async mine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async submit(@Body() dto: SubmitReferralDto) {
    const data = await this.service.submit(dto);
    return { data };
  }
}
