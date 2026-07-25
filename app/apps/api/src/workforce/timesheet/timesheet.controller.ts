import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateTimesheetEntryDto } from "./dto/create-timesheet-entry.dto";
import { DecideTimesheetEntryDto } from "./dto/decide-timesheet-entry.dto";
import { TimesheetService } from "./timesheet.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/07-workforce-management/05-timesheets.md */
@Controller("workforce/timesheets")
export class TimesheetController {
  constructor(private readonly service: TimesheetService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTimesheetEntryDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("team")
  async listForApproval() {
    const data = await this.service.listForApproval();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string, @Body() dto: DecideTimesheetEntryDto) {
    const data = await this.service.decide(id, "Approved", dto.note);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: DecideTimesheetEntryDto) {
    const data = await this.service.decide(id, "Rejected", dto.note);
    return { data };
  }

  @Post(":id/withdraw")
  @HttpCode(200)
  async withdraw(@Param("id") id: string) {
    await this.service.withdraw(id);
    return { data: { withdrawn: true } };
  }
}
