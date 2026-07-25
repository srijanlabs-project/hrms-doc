import { Body, Controller, Get, Put } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { UpdateStatutorySettingsDto } from "./dto/update-statutory-settings.dto";
import { StatutoryComplianceService } from "./statutory-compliance.service";

/** HTTP only — no business logic. Real computed statutory checks: minimum wages, LWF liability, bonus eligibility. */
@Controller("compliance/statutory")
@Roles("org_admin", "hr_ops")
export class StatutoryComplianceController {
  constructor(private readonly service: StatutoryComplianceService) {}

  @Get("settings")
  async getSettings() {
    const data = await this.service.getSettings();
    return { data };
  }

  @Put("settings")
  async updateSettings(@Body() dto: UpdateStatutorySettingsDto) {
    const data = await this.service.updateSettings(dto);
    return { data };
  }

  @Get("minimum-wage-check")
  async checkMinimumWages() {
    const data = await this.service.checkMinimumWages();
    return { data };
  }

  @Get("lwf-liability")
  async computeLwfLiability() {
    const data = await this.service.computeLwfLiability();
    return { data };
  }

  @Get("bonus-eligibility")
  async checkBonusEligibility() {
    const data = await this.service.checkBonusEligibility();
    return { data };
  }
}
