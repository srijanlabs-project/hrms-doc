import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateTestCaseDto } from "./dto/create-test-case.dto";
import { CreateTestSuiteDto } from "./dto/create-test-suite.dto";
import { TestSuiteService } from "./test-suite.service";

/** HTTP only — no business logic. Wave 5·E32 gap closure. Admin-only (QA-facing, not employee self-service). */
@Roles("org_admin", "hr_ops")
@Controller("testing/suites")
export class TestSuiteController {
  constructor(private readonly service: TestSuiteService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTestSuiteDto) {
    const data = await this.service.createSuite(dto);
    return { data };
  }

  @Get()
  async list() {
    const data = await this.service.listSuites();
    return { data };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const data = await this.service.getSuite(id);
    return { data };
  }

  @Post(":id/cases")
  @HttpCode(201)
  async addCase(@Param("id") id: string, @Body() dto: CreateTestCaseDto) {
    const data = await this.service.addCase(id, dto);
    return { data };
  }
}
