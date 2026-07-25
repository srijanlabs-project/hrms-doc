import { Controller, Get, Param } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ArrearService } from "./arrear.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/09-payroll/04-arrears-and-retro-pay.md */
@Controller("payroll/arrears")
@Roles("org_admin", "hr_ops")
export class ArrearController {
  constructor(private readonly service: ArrearService) {}

  @Get("employee/:employeeId")
  async listForEmployee(@Param("employeeId") employeeId: string) {
    const data = await this.service.listForEmployee(employeeId);
    return { data };
  }
}
