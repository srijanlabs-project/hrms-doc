import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateImportBatchDto } from "./dto/create-import-batch.dto";
import { ImportEngineService } from "./import-engine.service";

/** W0·E31 Implementation and Migration — configurable multi-module data import. */
@Roles("org_admin", "hr_ops")
@Controller("implementation/import-batches")
export class ImportBatchController {
  constructor(private readonly service: ImportEngineService) {}

  @Post()
  async run(@Body() dto: CreateImportBatchDto) {
    return { data: await this.service.processRows(dto.entityType, dto.rows, dto.dryRun ?? false) };
  }

  @Get()
  async list() {
    return { data: await this.service.listBatches() };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return { data: await this.service.getBatch(id) };
  }

  @Post(":id/rollback")
  async rollback(@Param("id") id: string) {
    return { data: await this.service.rollback(id) };
  }
}
