import { Controller, Get, Query, Res } from "@nestjs/common";
import type { Response } from "express";
import { Roles } from "../../auth/decorators/roles.decorator";
import { BulkExportService } from "./bulk-export.service";
import type { ExportableEntityType } from "./export-field-registry";

/** W0·E31 Implementation and Migration — bulk export. Same-origin link pattern (payroll bank-file, E25 custom-report export). */
@Roles("org_admin", "hr_ops")
@Controller("implementation/export")
export class BulkExportController {
  constructor(private readonly service: BulkExportService) {}

  @Get()
  async export(@Query("entityType") entityType: ExportableEntityType, @Res() res: Response) {
    const { filename, csv } = await this.service.exportCsv(entityType);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
