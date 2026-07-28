import { Module } from "@nestjs/common";
import { PeopleModule } from "../people/people.module";
import { CustomReportController } from "./custom-report/custom-report.controller";
import { CustomReportRepository } from "./custom-report/custom-report.repository";
import { CustomReportService } from "./custom-report/custom-report.service";
import { WorkforceAnalyticsController } from "./workforce/workforce-analytics.controller";
import { WorkforceAnalyticsService } from "./workforce/workforce-analytics.service";

/**
 * W5·E25 Analytics and BI — beyond Reports v1 (reports.module.ts's fixed KPI
 * summary). Workforce trend analytics (headcount/attrition, live-computed)
 * plus a configurable custom-report builder (field-allowlist registry +
 * dynamic query + CSV export). Predictive analytics, the Strategic Command
 * Centre dashboard, and scheduled report distribution stay deferred — no ML
 * pipeline or notification-delivery scheduler exists for the latter two.
 */
@Module({
  imports: [PeopleModule],
  controllers: [WorkforceAnalyticsController, CustomReportController],
  providers: [WorkforceAnalyticsService, CustomReportRepository, CustomReportService],
  exports: [WorkforceAnalyticsService],
})
export class AnalyticsModule {}
