import { Controller, Get, Param } from "@nestjs/common";
import { TimelineService } from "./timeline.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/02-people-management/15-employee-timeline.md */
@Controller("people/employees/:employeeId/timeline")
export class TimelineController {
  constructor(private readonly service: TimelineService) {}

  @Get()
  async getTimeline(@Param("employeeId") employeeId: string) {
    const data = await this.service.getTimeline(employeeId);
    return { data };
  }
}
