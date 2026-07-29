import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { RecordTestResultDto } from "./dto/record-test-result.dto";
import { SignoffTestRunDto } from "./dto/signoff-test-run.dto";
import { TestRunService } from "./test-run.service";

/** HTTP only — no business logic. Wave 5·E32 gap closure. Admin-only (QA-facing, not employee self-service). */
@Roles("org_admin", "hr_ops")
@Controller("testing/runs")
export class TestRunController {
  constructor(private readonly service: TestRunService) {}

  @Post()
  @HttpCode(201)
  async start(@Body("suiteId") suiteId: string) {
    const data = await this.service.startRun(suiteId);
    return { data };
  }

  @Get()
  async list() {
    const data = await this.service.listRuns();
    return { data };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const data = await this.service.getRun(id);
    return { data };
  }

  @Post(":id/results")
  @HttpCode(200)
  async recordResult(@Param("id") id: string, @Body() dto: RecordTestResultDto) {
    const data = await this.service.recordResult(id, dto);
    return { data };
  }

  @Post(":id/signoff")
  @HttpCode(200)
  async signoff(@Param("id") id: string, @Body() dto: SignoffTestRunDto) {
    const data = await this.service.signoff(id, dto);
    return { data };
  }
}
