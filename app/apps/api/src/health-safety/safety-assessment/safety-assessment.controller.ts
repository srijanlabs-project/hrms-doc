import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CompleteSafetyAssessmentDto } from "./dto/complete-safety-assessment.dto";
import { CreateSafetyAssessmentDto } from "./dto/create-safety-assessment.dto";
import { SafetyAssessmentService } from "./safety-assessment.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/22-health-safety-wellness.md */
@Controller("health-safety/assessments")
@Roles("org_admin", "hr_ops")
export class SafetyAssessmentController {
  constructor(private readonly service: SafetyAssessmentService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateSafetyAssessmentDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get()
  async listAll(@Query("status") status?: string) {
    const data = await this.service.listAll(status);
    return { data };
  }

  @Post(":id/complete")
  @HttpCode(200)
  async complete(@Param("id") id: string, @Body() dto: CompleteSafetyAssessmentDto) {
    const data = await this.service.complete(id, dto);
    return { data };
  }
}
