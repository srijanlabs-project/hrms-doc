import { Controller, Get } from "@nestjs/common";
import { LeaveBalanceService } from "./leave-balance.service";

@Controller("leave/balances")
export class LeaveBalanceController {
  constructor(private readonly service: LeaveBalanceService) {}

  @Get()
  async list() {
    const data = await this.service.getMyBalances();
    return { data };
  }
}
