import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { UpdateGoalProgressDto } from "./dto/update-goal-progress.dto";
import { GoalService } from "./goal.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/11-performance-management/01-goal-management.md */
@Controller("performance/goals")
export class GoalController {
  constructor(private readonly service: GoalService) {}

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("team")
  async listTeam() {
    const data = await this.service.listTeam();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateGoalDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/progress")
  @HttpCode(200)
  async updateProgress(@Param("id") id: string, @Body() dto: UpdateGoalProgressDto) {
    const data = await this.service.updateProgress(id, dto.progress, dto.note);
    return { data };
  }

  @Post(":id/complete")
  @HttpCode(200)
  async complete(@Param("id") id: string) {
    const data = await this.service.complete(id);
    return { data };
  }
}
