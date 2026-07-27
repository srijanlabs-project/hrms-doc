import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AssessCompetencyDto } from "./dto/assess-competency.dto";
import { CreateCompetencyDto } from "./dto/create-competency.dto";
import { CompetencyService } from "./competency.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/11-performance-management.md */
@Controller("performance/competencies")
export class CompetencyController {
  constructor(private readonly service: CompetencyService) {}

  @Get()
  async listCatalog() {
    const data = await this.service.listCatalog();
    return { data };
  }

  @Post()
  @HttpCode(201)
  @Roles("org_admin", "hr_ops")
  async createCatalogEntry(@Body() dto: CreateCompetencyDto) {
    const data = await this.service.createCatalogEntry(dto);
    return { data };
  }

  @Get("assessments/mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("assessments/employee/:employeeId")
  async listForEmployee(@Param("employeeId") employeeId: string) {
    const data = await this.service.listForEmployee(employeeId);
    return { data };
  }

  @Post("assessments")
  @HttpCode(201)
  async assess(@Body() dto: AssessCompetencyDto) {
    const data = await this.service.assess(dto);
    return { data };
  }
}
