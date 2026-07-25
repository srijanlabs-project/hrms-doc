import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { MarkAttendanceDto } from "./dto/mark-attendance.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/07-workforce-management/01-attendance.md */
@Controller("attendance")
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post("mark")
  @HttpCode(200)
  async mark(@Body() dto: MarkAttendanceDto) {
    const data = await this.service.mark(dto);
    return { data };
  }

  @Get("my")
  async listMine(@Query("from") from?: string, @Query("to") to?: string) {
    const data = await this.service.listMine(from, to);
    return { data };
  }

  @Get("team")
  async listTeam(@Query("date") date?: string) {
    const data = await this.service.listTeamForDate(date);
    return { data };
  }
}
