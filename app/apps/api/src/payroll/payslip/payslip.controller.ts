import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { PayslipService } from "./payslip.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/09-payroll/07-full-and-final-settlement.md (payslip view). */
@Controller("payroll/payslips")
export class PayslipController {
  constructor(private readonly service: PayslipService) {}

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("my/:year/:month")
  async getMine(@Param("year", ParseIntPipe) year: number, @Param("month", ParseIntPipe) month: number) {
    const data = await this.service.getMine(year, month);
    return { data };
  }
}
