import { Controller, Get } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ComplianceOverviewService } from "./compliance-overview.service";

/** W0·E29 Security and Governance — compliance monitoring rollup. */
@Roles("org_admin", "hr_ops")
@Controller("security/compliance-overview")
export class ComplianceOverviewController {
  constructor(private readonly service: ComplianceOverviewService) {}

  @Get()
  async get() {
    return { data: await this.service.getOverview() };
  }
}
