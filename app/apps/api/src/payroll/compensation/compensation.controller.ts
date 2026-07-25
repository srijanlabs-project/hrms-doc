import { Body, Controller, Get, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CompensationService } from "./compensation.service";
import { SetCompensationDto } from "./dto/set-compensation.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/09-payroll/01-salary-structures.md */
@Controller("payroll/compensation")
@Roles("org_admin", "hr_ops")
export class CompensationController {
  constructor(private readonly service: CompensationService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Post()
  async set(@Body() dto: SetCompensationDto) {
    const data = await this.service.set(dto);
    return { data };
  }
}
