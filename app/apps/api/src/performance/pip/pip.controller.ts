import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ClosePipDto } from "./dto/close-pip.dto";
import { CreatePipDto } from "./dto/create-pip.dto";
import { PipService } from "./pip.service";

/** HTTP only — no business logic. W3·E11 gap closure: Performance Improvement Plans. */
@Controller("performance/pips")
export class PipController {
  constructor(private readonly service: PipService) {}

  @Post()
  @HttpCode(201)
  @Roles("org_admin", "hr_ops", "manager")
  async create(@Body() dto: CreatePipDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("team")
  @Roles("org_admin", "hr_ops", "manager")
  async listTeam() {
    const data = await this.service.listTeam();
    return { data };
  }

  @Get()
  @Roles("org_admin", "hr_ops")
  async listAllAdmin() {
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Post("objectives/:objectiveId/complete")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops", "manager")
  async completeObjective(@Param("objectiveId") objectiveId: string) {
    const data = await this.service.completeObjective(objectiveId);
    return { data };
  }

  @Post(":id/close")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops", "manager")
  async close(@Param("id") id: string, @Body() dto: ClosePipDto) {
    const data = await this.service.close(id, dto);
    return { data };
  }
}
