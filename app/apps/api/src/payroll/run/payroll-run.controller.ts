import { Body, Controller, Get, HttpCode, Param, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { Roles } from "../../auth/decorators/roles.decorator";
import { PayrollDocumentService } from "../document/payroll-document.service";
import { FinanceExportService } from "../finance-export/finance-export.service";
import { CreatePayrollRunDto } from "./dto/create-payroll-run.dto";
import { PayrollRunService } from "./payroll-run.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/09-payroll/05-payroll-processing.md */
@Controller("payroll/runs")
@Roles("org_admin", "hr_ops")
export class PayrollRunController {
  constructor(
    private readonly service: PayrollRunService,
    private readonly financeExportService: FinanceExportService,
    private readonly payrollDocumentService: PayrollDocumentService,
  ) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePayrollRunDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/process")
  @HttpCode(200)
  async process(@Param("id") id: string) {
    const data = await this.service.process(id);
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Post(":id/close")
  @HttpCode(200)
  async close(@Param("id") id: string) {
    const data = await this.service.close(id);
    return { data };
  }

  /** Spec: 08-submodule-specifications/27-integration-platform/05-finance-systems-integration.md */
  @Get(":id/bank-file")
  async bankFile(@Param("id") id: string, @Res() res: Response) {
    const { filename, csv, missingBankAccountCount } = await this.financeExportService.generateBankFile(id);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("X-Missing-Bank-Account-Count", String(missingBankAccountCount));
    res.send(csv);
  }

  /** Per-employee salary advice letter — distinct from the bulk bank-file export above. */
  @Post(":id/employees/:employeeId/bank-advice")
  @HttpCode(201)
  async bankAdvice(@Param("id") id: string, @Param("employeeId") employeeId: string) {
    const data = await this.payrollDocumentService.generateBankAdvice(id, employeeId);
    return { data };
  }
}
