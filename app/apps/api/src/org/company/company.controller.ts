import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/01-organization-management/01-company.md */
@Controller("org/companies")
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateCompanyDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
