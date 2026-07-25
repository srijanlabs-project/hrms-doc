import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateAdjustmentDto } from "./dto/create-adjustment.dto";
import { RunCarryForwardDto } from "./dto/run-carry-forward.dto";
import { LeaveLedgerService } from "./leave-ledger.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/08-leave-management/02-leave-accrual.md */
@Controller("leave/ledger")
export class LeaveLedgerController {
  constructor(private readonly service: LeaveLedgerService) {}

  @Roles("org_admin", "hr_ops")
  @Post("adjustments")
  @HttpCode(201)
  async postAdjustment(@Body() dto: CreateAdjustmentDto) {
    const data = await this.service.postAdjustment(dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("carry-forward/run")
  @HttpCode(200)
  async runCarryForward(@Body() dto: RunCarryForwardDto) {
    const data = await this.service.runCarryForward(dto.fromYear);
    return { data };
  }

  @Get(":employeeId")
  async getLedger(@Param("employeeId") employeeId: string) {
    const data = await this.service.getLedger(employeeId);
    return { data };
  }
}
