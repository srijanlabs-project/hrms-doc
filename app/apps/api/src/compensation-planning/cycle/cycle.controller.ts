import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CycleService } from "./cycle.service";
import { CreateCycleDto } from "./dto/create-cycle.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Spec: 08-submodule-specifications/14-compensation-and-benefits/03-merit-cycles.md */
@Roles(...ADMIN_ROLES)
@Controller("compensation-planning/cycles")
export class CycleController {
  constructor(private readonly service: CycleService) {}

  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Post()
  async create(@Body() dto: CreateCycleDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/close")
  async close(@Param("id") id: string) {
    const data = await this.service.close(id);
    return { data };
  }
}
