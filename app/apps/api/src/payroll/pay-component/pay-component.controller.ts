import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AssignPayComponentDto } from "./dto/assign-pay-component.dto";
import { CreatePayComponentDto } from "./dto/create-pay-component.dto";
import { PayComponentService } from "./pay-component.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/09-payroll/02-pay-components.md */
@Controller("payroll/pay-components")
@Roles("org_admin", "hr_ops")
export class PayComponentController {
  constructor(private readonly service: PayComponentService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePayComponentDto) {
    const data = await this.service.createComponent(dto);
    return { data };
  }

  @Get()
  async list() {
    const data = await this.service.listComponents();
    return { data };
  }

  @Post("assign")
  @HttpCode(201)
  async assign(@Body() dto: AssignPayComponentDto) {
    const data = await this.service.assign(dto);
    return { data };
  }

  @Get("employee/:employeeId")
  async listForEmployee(@Param("employeeId") employeeId: string) {
    const data = await this.service.listForEmployee(employeeId);
    return { data };
  }
}
