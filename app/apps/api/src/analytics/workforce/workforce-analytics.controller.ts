import { Controller, Get, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { WorkforceAnalyticsService } from "./workforce-analytics.service";

/** W5·E25 Analytics and BI — workforce headcount/attrition trend. */
@Roles("org_admin", "hr_ops")
@Controller("analytics/workforce")
export class WorkforceAnalyticsController {
  constructor(private readonly service: WorkforceAnalyticsService) {}

  @Get("trend")
  async getTrend(@Query("months") months?: string) {
    const parsed = months ? Number.parseInt(months, 10) : 12;
    const data = await this.service.getTrend(Number.isFinite(parsed) ? parsed : 12);
    return { data };
  }
}
