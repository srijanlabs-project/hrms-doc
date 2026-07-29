import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { GenerateTestDataDto } from "./dto/generate-test-data.dto";
import { TestDataService } from "./test-data.service";

/** HTTP only — no business logic. Wave 5·E32 gap closure ("test data management"). Admin-only. */
@Roles("org_admin", "hr_ops")
@Controller("testing/test-data")
export class TestDataController {
  constructor(private readonly service: TestDataService) {}

  @Post("generate")
  @HttpCode(201)
  async generate(@Body() dto: GenerateTestDataDto) {
    const data = await this.service.generateSyntheticEmployees(dto.count);
    return { data };
  }

  @Get("batches")
  async listBatches() {
    const data = await this.service.listBatches();
    return { data };
  }

  @Post("batches/:id/purge")
  @HttpCode(200)
  async purge(@Param("id") id: string) {
    const data = await this.service.purgeBatch(id);
    return { data };
  }
}
