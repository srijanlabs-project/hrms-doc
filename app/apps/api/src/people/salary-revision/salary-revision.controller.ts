import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateSalaryRevisionDto } from "./dto/create-salary-revision.dto";
import { DecideSalaryRevisionDto } from "./dto/decide-salary-revision.dto";
import { SalaryRevisionService } from "./salary-revision.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/02-people-management/12-salary-revision.md */
@Roles("org_admin", "hr_ops")
@Controller("people")
export class SalaryRevisionController {
  constructor(private readonly service: SalaryRevisionService) {}

  @Get("employees/:employeeId/salary-revisions")
  async listForEmployee(@Param("employeeId") employeeId: string) {
    const data = await this.service.listForEmployee(employeeId);
    return { data };
  }

  @Get("salary-revisions")
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Post("employees/:employeeId/salary-revisions")
  @HttpCode(201)
  async propose(@Param("employeeId") employeeId: string, @Body() dto: CreateSalaryRevisionDto) {
    const data = await this.service.propose(employeeId, dto);
    return { data };
  }

  @Post("salary-revisions/:id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string, @Body() dto: DecideSalaryRevisionDto) {
    const data = await this.service.approve(id, dto.note);
    return { data };
  }

  @Post("salary-revisions/:id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: DecideSalaryRevisionDto) {
    const data = await this.service.reject(id, dto.note);
    return { data };
  }

  @Post("salary-revisions/:id/apply")
  @HttpCode(200)
  async apply(@Param("id") id: string) {
    const data = await this.service.apply(id);
    return { data };
  }
}
