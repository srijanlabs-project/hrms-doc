import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AppraisalService } from "./appraisal.service";
import { CreateAppraisalDto } from "./dto/create-appraisal.dto";
import { SubmitReviewDto } from "./dto/submit-review.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/11-performance-management/02-appraisals.md */
@Controller("performance/appraisals")
export class AppraisalController {
  constructor(private readonly service: AppraisalService) {}

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

  @Roles("org_admin", "hr_ops")
  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateAppraisalDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/self-review")
  @HttpCode(200)
  async submitSelfReview(@Param("id") id: string, @Body() dto: SubmitReviewDto) {
    const data = await this.service.submitSelfReview(id, dto.rating, dto.comments);
    return { data };
  }

  @Post(":id/manager-review")
  @HttpCode(200)
  async submitManagerReview(@Param("id") id: string, @Body() dto: SubmitReviewDto) {
    const data = await this.service.submitManagerReview(id, dto.rating, dto.comments);
    return { data };
  }

  @Post(":id/finalize")
  @HttpCode(200)
  async finalize(@Param("id") id: string) {
    const data = await this.service.finalize(id);
    return { data };
  }
}
