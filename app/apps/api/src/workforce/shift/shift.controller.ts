import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AssignShiftDto } from "./dto/assign-shift.dto";
import { CreateShiftDto } from "./dto/create-shift.dto";
import { ShiftService } from "./shift.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/07-workforce-management/03-shift-management.md */
@Controller("workforce/shifts")
export class ShiftController {
  constructor(private readonly service: ShiftService) {}

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateShiftDto) {
    const data = await this.service.createShift(dto);
    return { data };
  }

  @Get()
  async list() {
    const data = await this.service.listShifts();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("assignments")
  @HttpCode(201)
  async assign(@Body() dto: AssignShiftDto) {
    const data = await this.service.assign(dto);
    return { data };
  }

  @Get("assignments/mine")
  async mine() {
    const data = await this.service.myShift();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("assignments")
  async listAllActive() {
    const data = await this.service.listAllActive();
    return { data };
  }
}
