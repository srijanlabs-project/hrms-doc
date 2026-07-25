import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ItemService } from "./item.service";
import { ProposeItemDto } from "./dto/propose-item.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Spec: 08-submodule-specifications/14-compensation-and-benefits/03-merit-cycles.md */
@Roles(...ADMIN_ROLES)
@Controller("compensation-planning/items")
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  async listForCycle(@Query("cycleId") cycleId: string) {
    const data = await this.service.listForCycle(cycleId);
    return { data };
  }

  @Post()
  async propose(@Query("cycleId") cycleId: string, @Body() dto: ProposeItemDto) {
    const data = await this.service.propose(cycleId, dto);
    return { data };
  }

  @Post(":id/approve")
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Post(":id/apply")
  async apply(@Param("id") id: string) {
    const data = await this.service.apply(id);
    return { data };
  }
}
