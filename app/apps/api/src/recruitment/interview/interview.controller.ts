import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ScheduleInterviewDto } from "./dto/schedule-interview.dto";
import { SubmitFeedbackDto } from "./dto/submit-feedback.dto";
import { InterviewService } from "./interview.service";

/** HTTP only — no business logic. Spec: 06-interview-scheduling.md, 07-interview-feedback.md. */
@Controller("recruitment/interviews")
@Roles("org_admin", "hr_ops")
export class InterviewController {
  constructor(private readonly service: InterviewService) {}

  @Get()
  async listForApplication(@Query("applicationId") applicationId: string) {
    const data = await this.service.listForApplication(applicationId);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async schedule(@Body() dto: ScheduleInterviewDto) {
    const data = await this.service.schedule(dto);
    return { data };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    const data = await this.service.cancel(id);
    return { data };
  }

  @Post(":id/feedback")
  @HttpCode(201)
  async submitFeedback(@Param("id") id: string, @Body() dto: SubmitFeedbackDto) {
    const data = await this.service.submitFeedback(id, dto);
    return { data };
  }
}
