import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CustomReportService } from "./custom-report.service";
import { CreateReportDefinitionDto } from "./dto/create-report-definition.dto";
import { RunReportDto } from "./dto/run-report.dto";
import type { ReportableEntityType } from "./field-registry";

/** W5·E25 Analytics and BI — configurable custom-report builder. */
@Roles("org_admin", "hr_ops")
@Controller("analytics/reports")
export class CustomReportController {
  constructor(private readonly service: CustomReportService) {}

  @Get("fields")
  async listFields() {
    return { data: this.service.listEntityTypes() };
  }

  @Get()
  async list() {
    return { data: await this.service.listDefinitions() };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateReportDefinitionDto) {
    return { data: await this.service.createDefinition(dto) };
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: string) {
    await this.service.deleteDefinition(id);
  }

  @Post("run")
  async run(@Body() dto: RunReportDto) {
    return { data: await this.service.runAdHoc(dto) };
  }

  @Get(":id/run")
  async runSaved(@Param("id") id: string) {
    return { data: await this.service.runSaved(id) };
  }

  /** Same-origin link — a plain <a href> download, session cookie rides along automatically. */
  @Get("export")
  async export(
    @Query("entityType") entityType: ReportableEntityType,
    @Query("selectedFields") selectedFields: string,
    @Query("filters") filters: string | undefined,
    @Res() res: Response,
  ) {
    const { filename, csv } = await this.service.exportCsv({
      entityType,
      selectedFields: selectedFields ? selectedFields.split(",") : [],
      filters: filters ? (JSON.parse(filters) as Record<string, string | number | boolean>) : undefined,
    });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
