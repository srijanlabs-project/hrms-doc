import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CandidateAssessmentService } from "./candidate-assessment.service";
import { CreateAssessmentDto } from "./dto/create-assessment.dto";

/** HTTP only — no business logic. W3·E06 Recruitment and ATS gap closure: pre-hire candidate assessments. */
@Controller("recruitment/candidates/:candidateId/assessments")
@Roles("org_admin", "hr_ops")
export class CandidateAssessmentController {
  constructor(private readonly service: CandidateAssessmentService) {}

  @Get()
  async list(@Param("candidateId") candidateId: string) {
    const data = await this.service.listForCandidate(candidateId);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Param("candidateId") candidateId: string, @Body() dto: CreateAssessmentDto) {
    const data = await this.service.create(candidateId, dto);
    return { data };
  }
}
