import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AssetAuditService } from "./audit.service";
import { CreateAuditCycleDto } from "./dto/create-audit-cycle.dto";
import { DecideAuditItemDto } from "./dto/decide-audit-item.dto";

/** HTTP only — no business logic. Wave 4·E18 gap closure ("asset audits"). Admin-only. */
@Roles("org_admin", "hr_ops")
@Controller("assets/audits")
export class AssetAuditController {
  constructor(private readonly service: AssetAuditService) {}

  @Post()
  async start(@Body() dto: CreateAuditCycleDto) {
    return { data: await this.service.startCycle(dto.periodLabel) };
  }

  @Get()
  async list() {
    return { data: await this.service.listCycles() };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return { data: await this.service.getCycle(id) };
  }

  @Post(":id/close")
  async close(@Param("id") id: string) {
    return { data: await this.service.closeCycle(id) };
  }

  @Post("items/:itemId/verify")
  async verifyItem(@Param("itemId") itemId: string, @Body() dto: DecideAuditItemDto) {
    return { data: await this.service.decideItem(itemId, "Verified", dto.notes) };
  }

  @Post("items/:itemId/missing")
  async missingItem(@Param("itemId") itemId: string, @Body() dto: DecideAuditItemDto) {
    return { data: await this.service.decideItem(itemId, "Missing", dto.notes) };
  }

  @Post("items/:itemId/damaged")
  async damagedItem(@Param("itemId") itemId: string, @Body() dto: DecideAuditItemDto) {
    return { data: await this.service.decideItem(itemId, "Damaged", dto.notes) };
  }
}
