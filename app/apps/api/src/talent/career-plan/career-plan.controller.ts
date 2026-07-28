import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CareerPlanService } from "./career-plan.service";
import { AddCareerPlanActionDto } from "./dto/add-career-plan-action.dto";
import { CreateCareerPlanDto } from "./dto/create-career-plan.dto";
import { UpdateCareerPlanStatusDto } from "./dto/update-career-plan-status.dto";

/** HTTP only — no business logic. Wave 3 E13 gap closure: career planning. */
@Controller("talent/career-plans")
export class CareerPlanController {
  constructor(private readonly service: CareerPlanService) {}

  @Post()
  @HttpCode(201)
  async createMine(@Body() dto: CreateCareerPlanDto) {
    const data = await this.service.createMine(dto);
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

  @Post(":id/actions")
  @HttpCode(201)
  async addAction(@Param("id") id: string, @Body() dto: AddCareerPlanActionDto) {
    const data = await this.service.addAction(id, dto.title);
    return { data };
  }

  @Post("actions/:actionId/complete")
  @HttpCode(200)
  async completeAction(@Param("actionId") actionId: string) {
    const data = await this.service.completeAction(actionId);
    return { data };
  }

  @Post(":id/status")
  @HttpCode(200)
  async updateStatus(@Param("id") id: string, @Body() dto: UpdateCareerPlanStatusDto) {
    const data = await this.service.updateStatus(id, dto);
    return { data };
  }
}
