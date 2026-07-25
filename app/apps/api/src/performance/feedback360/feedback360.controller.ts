import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { CreateFeedbackCampaignDto } from "./dto/create-campaign.dto";
import { NominateRaterDto } from "./dto/nominate-rater.dto";
import { SubmitFeedback360ResponseDto } from "./dto/submit-response.dto";
import { Feedback360Service } from "./feedback360.service";

/**
 * HTTP only — no business logic. Spec: 08-submodule-specifications/11-performance-management/03-360-feedback.md.
 * No @Roles at the controller level — campaign management is gated in the
 * service to org_admin/hr_ops or the subject's own manager, and response
 * submission is gated to the nominated rater themselves.
 */
@Controller("performance/360")
export class Feedback360Controller {
  constructor(private readonly service: Feedback360Service) {}

  @Get("campaigns")
  async listForSubject(@Query("subjectEmployeeId") subjectEmployeeId: string) {
    const data = await this.service.listForSubject(subjectEmployeeId);
    return { data };
  }

  @Get("my-summary")
  async mySummary() {
    const data = await this.service.myReleasedSummaries();
    return { data };
  }

  @Get("my-requests")
  async myRequests() {
    const data = await this.service.myPendingRequests();
    return { data };
  }

  @Post("campaigns")
  @HttpCode(201)
  async create(@Body() dto: CreateFeedbackCampaignDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post("campaigns/:id/raters")
  @HttpCode(201)
  async nominateRater(@Param("id") id: string, @Body() dto: NominateRaterDto) {
    const data = await this.service.nominateRater(id, dto);
    return { data };
  }

  @Post("campaigns/:id/open")
  @HttpCode(200)
  async open(@Param("id") id: string) {
    const data = await this.service.open(id);
    return { data };
  }

  @Post("campaigns/:id/close")
  @HttpCode(200)
  async close(@Param("id") id: string) {
    const data = await this.service.close(id);
    return { data };
  }

  @Post("raters/:id/respond")
  @HttpCode(200)
  async respond(@Param("id") id: string, @Body() dto: SubmitFeedback360ResponseDto) {
    const data = await this.service.submitResponse(id, dto);
    return { data };
  }
}
