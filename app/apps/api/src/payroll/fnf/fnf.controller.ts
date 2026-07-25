import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateFnfCaseDto } from "./dto/create-fnf-case.dto";
import { FnfService } from "./fnf.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/09-payroll/07-full-and-final-settlement.md */
@Controller("payroll/fnf/cases")
@Roles("org_admin", "hr_ops")
export class FnfController {
  constructor(private readonly service: FnfService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateFnfCaseDto) {
    const data = await this.service.createFromExit(dto.employeeId);
    return { data };
  }

  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Post(":id/release")
  @HttpCode(200)
  async release(@Param("id") id: string) {
    const data = await this.service.release(id);
    return { data };
  }
}
