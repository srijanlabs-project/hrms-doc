import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CalibrationService } from "./calibration.service";
import { AdjustCalibrationCaseDto } from "./dto/adjust-case.dto";
import { CreateCalibrationSessionDto } from "./dto/create-session.dto";
import { GenerateCalibrationCasesDto } from "./dto/generate-cases.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/11-performance-management/04-calibration.md */
@Controller("performance/calibration")
@Roles("org_admin", "hr_ops")
export class CalibrationController {
  constructor(private readonly service: CalibrationService) {}

  @Get("sessions")
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Get("sessions/:id")
  async getById(@Param("id") id: string) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Post("sessions")
  @HttpCode(201)
  async create(@Body() dto: CreateCalibrationSessionDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post("sessions/:id/generate-cases")
  @HttpCode(200)
  async generateCases(@Param("id") id: string, @Body() dto: GenerateCalibrationCasesDto) {
    const data = await this.service.generateCases(id, dto.departmentId);
    return { data };
  }

  @Post("sessions/:id/close")
  @HttpCode(200)
  async closeSession(@Param("id") id: string) {
    const data = await this.service.closeSession(id);
    return { data };
  }

  @Post("cases/:id/adjust")
  @HttpCode(200)
  async adjustCase(@Param("id") id: string, @Body() dto: AdjustCalibrationCaseDto) {
    const data = await this.service.adjustCase(id, dto);
    return { data };
  }
}
