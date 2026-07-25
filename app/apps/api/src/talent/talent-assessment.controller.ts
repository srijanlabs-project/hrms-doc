import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { TalentAssessmentService } from "./talent-assessment.service";
import { UpsertTalentAssessmentDto } from "./dto/upsert-talent-assessment.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * HTTP only — no business logic. Spec: 08-submodule-specifications/13-talent-management/02-talent-reviews.md.
 * Every route is admin/hr-ops gated per the spec's section 10 security
 * requirement that talent-review data is restricted to authorized HR and
 * leadership roles — there is no employee self-service view in v1.
 */
@Roles(...ADMIN_ROLES)
@Controller("talent/assessments")
export class TalentAssessmentController {
  constructor(private readonly service: TalentAssessmentService) {}

  @Get()
  async listForPeriod(@Query("periodYear") periodYear: string) {
    const data = await this.service.listForPeriod(Number(periodYear));
    return { data };
  }

  @Post()
  async upsert(@Body() dto: UpsertTalentAssessmentDto) {
    const data = await this.service.upsert(dto);
    return { data };
  }
}
