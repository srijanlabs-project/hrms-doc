import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreateExpenseClaimDto } from "./dto/create-expense-claim.dto";
import { DecideExpenseClaimDto } from "./dto/decide-expense-claim.dto";
import { ExpenseClaimService } from "./expense-claim.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/17-expense-management/01-expense-claims.md */
@Controller("expense/claims")
export class ExpenseClaimController {
  constructor(private readonly service: ExpenseClaimService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateExpenseClaimDto) {
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
  async approve(@Param("id") id: string, @Body() dto: DecideExpenseClaimDto) {
    const data = await this.service.decide(id, "Approved", dto.note);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: DecideExpenseClaimDto) {
    const data = await this.service.decide(id, "Rejected", dto.note);
    return { data };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    await this.service.cancel(id);
    return { data: { cancelled: true } };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/mark-paid")
  @HttpCode(200)
  async markPaid(@Param("id") id: string) {
    const data = await this.service.markPaid(id);
    return { data };
  }
}
