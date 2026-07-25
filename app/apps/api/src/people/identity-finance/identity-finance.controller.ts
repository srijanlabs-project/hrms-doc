import { Body, Controller, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import { CreateIdentityDocumentDto } from "./dto/create-identity-document.dto";
import { UpsertTaxProfileDto } from "./dto/upsert-tax-profile.dto";
import { IdentityFinanceService } from "./identity-finance.service";

/** HTTP only — no business logic. Specs: 04-national-identity.md, 06-bank-accounts.md, 07-tax-information.md */
@Controller("people/employees/:employeeId")
export class IdentityFinanceController {
  constructor(private readonly service: IdentityFinanceService) {}

  @Get("identity-finance")
  async getAll(@Param("employeeId") employeeId: string) {
    const data = await this.service.getAll(employeeId);
    return { data };
  }

  @Post("identity-documents")
  @HttpCode(201)
  async addIdentityDocument(@Param("employeeId") employeeId: string, @Body() dto: CreateIdentityDocumentDto) {
    const data = await this.service.addIdentityDocument(employeeId, dto);
    return { data };
  }

  @Post("bank-accounts")
  @HttpCode(201)
  async addBankAccount(@Param("employeeId") employeeId: string, @Body() dto: CreateBankAccountDto) {
    const data = await this.service.addBankAccount(employeeId, dto);
    return { data };
  }

  @Put("tax-profile")
  @HttpCode(200)
  async upsertTaxProfile(@Param("employeeId") employeeId: string, @Body() dto: UpsertTaxProfileDto) {
    const data = await this.service.upsertTaxProfile(employeeId, dto);
    return { data };
  }
}
