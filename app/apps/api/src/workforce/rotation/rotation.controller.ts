import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AssignRotationDto } from "./dto/assign-rotation.dto";
import { CreatePatternDto } from "./dto/create-pattern.dto";
import { GenerateRosterDto } from "./dto/generate-roster.dto";
import { RotationService } from "./rotation.service";

/** HTTP only — no business logic. Workforce Management (E07) shift rotation, admin/hr_ops only. */
@Roles("org_admin", "hr_ops")
@Controller("workforce/rotation")
export class RotationController {
  constructor(private readonly service: RotationService) {}

  @Post("patterns")
  @HttpCode(201)
  async createPattern(@Body() dto: CreatePatternDto) {
    const data = await this.service.createPattern(dto);
    return { data };
  }

  @Get("patterns")
  async listPatterns() {
    const data = await this.service.listPatterns();
    return { data };
  }

  @Post("assign")
  @HttpCode(200)
  async assign(@Body() dto: AssignRotationDto) {
    const data = await this.service.assign(dto);
    return { data };
  }

  @Post("generate")
  @HttpCode(200)
  async generateRoster(@Body() dto: GenerateRosterDto) {
    const data = await this.service.generateRoster(dto);
    return { data };
  }
}
