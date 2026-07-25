import { Controller, Get } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { ReportsService } from "./reports.service";

/** HTTP only — no business logic. Org admin dashboard + Reports Hub v1. Spec: 07-appendices/40-reports-and-dashboards-master-inventory.md */
@Controller("reports")
@Roles("org_admin", "hr_ops")
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get("summary")
  async getSummary() {
    const data = await this.service.getSummary();
    return { data };
  }
}
