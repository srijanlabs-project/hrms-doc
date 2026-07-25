import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateSurveyDto } from "./dto/create-survey.dto";
import { SubmitSurveyResponseDto } from "./dto/submit-response.dto";
import { SurveyService } from "./survey.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/15-employee-experience.md */
@Controller("experience/surveys")
export class SurveyController {
  constructor(private readonly service: SurveyService) {}

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateSurveyDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("admin")
  async listAllAdmin() {
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/publish")
  @HttpCode(200)
  async publish(@Param("id") id: string) {
    const data = await this.service.publish(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/close")
  @HttpCode(200)
  async close(@Param("id") id: string) {
    const data = await this.service.close(id);
    return { data };
  }

  @Post(":id/responses")
  @HttpCode(201)
  async respond(@Param("id") id: string, @Body() dto: SubmitSurveyResponseDto) {
    const data = await this.service.respond(id, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get(":id/results")
  async getResults(@Param("id") id: string) {
    const data = await this.service.getResults(id);
    return { data };
  }
}
