import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateLoanAdvanceRequestDto } from "./dto/create-loan-advance-request.dto";
import { RejectLoanAdvanceRequestDto } from "./dto/reject-loan-advance-request.dto";
import { LoanAdvanceService } from "./loan-advance.service";

/** HTTP only — no business logic. Payroll (E09) loans and advances. */
@Controller("payroll/loans")
export class LoanAdvanceController {
  constructor(private readonly service: LoanAdvanceService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLoanAdvanceRequestDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll(@Query("status") status?: string) {
    const data = await this.service.listAll(status);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: RejectLoanAdvanceRequestDto) {
    const data = await this.service.reject(id, dto);
    return { data };
  }
}
