import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { SubmitAssessmentDto } from "./dto/submit-assessment.dto";
import { EnrollmentService } from "./enrollment.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/12-learning-and-development/{01-learning-management-system,03-compliance-training}.md */
@Controller("learning/enrollments")
export class EnrollmentController {
  constructor(private readonly service: EnrollmentService) {}

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("team")
  async listTeamMandatory() {
    const data = await this.service.listTeamMandatory();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async enroll(@Body() dto: CreateEnrollmentDto) {
    const data = await this.service.enroll(dto.courseId);
    return { data };
  }

  @Post(":id/complete")
  @HttpCode(200)
  async complete(@Param("id") id: string) {
    const data = await this.service.complete(id);
    return { data };
  }

  @Post(":id/assessment")
  @HttpCode(200)
  async submitAssessment(@Param("id") id: string, @Body() dto: SubmitAssessmentDto) {
    const data = await this.service.submitAssessment(id, dto.score, dto.maxScore);
    return { data };
  }

  @Post(":id/withdraw")
  @HttpCode(200)
  async withdraw(@Param("id") id: string) {
    const data = await this.service.withdraw(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("run-now")
  @HttpCode(200)
  async runNow() {
    await this.service.runNow();
    return { data: { triggered: true } };
  }
}
