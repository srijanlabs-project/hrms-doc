import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { BackgroundService } from "./background.service";
import { CreateCertificationDto } from "./dto/create-certification.dto";
import { CreateEducationDto } from "./dto/create-education.dto";
import { CreatePriorExperienceDto } from "./dto/create-prior-experience.dto";
import { CreateSkillDto } from "./dto/create-skill.dto";

/** HTTP only — no business logic. Covers "education and experience" and "certifications, skills, languages". */
@Controller("people/employees/:employeeId")
export class BackgroundController {
  constructor(private readonly service: BackgroundService) {}

  @Get("background")
  async getAll(@Param("employeeId") employeeId: string) {
    const data = await this.service.getAll(employeeId);
    return { data };
  }

  @Post("certifications")
  @HttpCode(201)
  async addCertification(@Param("employeeId") employeeId: string, @Body() dto: CreateCertificationDto) {
    const data = await this.service.addCertification(employeeId, dto);
    return { data };
  }

  @Post("skills")
  @HttpCode(201)
  async addSkill(@Param("employeeId") employeeId: string, @Body() dto: CreateSkillDto) {
    const data = await this.service.addSkill(employeeId, dto);
    return { data };
  }

  @Post("education")
  @HttpCode(201)
  async addEducation(@Param("employeeId") employeeId: string, @Body() dto: CreateEducationDto) {
    const data = await this.service.addEducation(employeeId, dto);
    return { data };
  }

  @Post("experience")
  @HttpCode(201)
  async addPriorExperience(@Param("employeeId") employeeId: string, @Body() dto: CreatePriorExperienceDto) {
    const data = await this.service.addPriorExperience(employeeId, dto);
    return { data };
  }
}
