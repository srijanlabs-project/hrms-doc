import { Controller, Get } from "@nestjs/common";
import { TeamDashboardService } from "./team-dashboard.service";

/** HTTP only — no business logic. Manager Self Service Team Dashboard. */
@Controller("mss/team-dashboard")
export class TeamDashboardController {
  constructor(private readonly service: TeamDashboardService) {}

  @Get()
  async getDashboard() {
    const data = await this.service.getDashboard();
    return { data };
  }
}
