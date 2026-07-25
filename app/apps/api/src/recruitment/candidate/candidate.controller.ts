import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CandidateService } from "./candidate.service";
import { CreateCandidateDto } from "./dto/create-candidate.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/06-recruitment-and-ats/04-candidate-portal.md (v1: internal record only, no candidate-facing portal). */
@Controller("recruitment/candidates")
@Roles("org_admin", "hr_ops")
export class CandidateController {
  constructor(private readonly service: CandidateService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateCandidateDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
