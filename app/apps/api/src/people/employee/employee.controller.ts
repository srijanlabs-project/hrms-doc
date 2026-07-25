import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { BulkImportEmployeesDto } from "./dto/bulk-import-employees.dto";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { SeparateEmployeeDto } from "./dto/separate-employee.dto";
import { UpdateOrgAssignmentDto } from "./dto/update-org-assignment.dto";
import { EmployeeService } from "./employee.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/02-people-management/01-employee-master.md */
@Controller("people/employees")
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const data = await this.service.get(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateEmployeeDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("bulk")
  @HttpCode(200)
  async bulkCreate(@Body() dto: BulkImportEmployeesDto) {
    const data = await this.service.bulkCreate(dto.rows);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/org-assignment")
  @HttpCode(200)
  async updateOrgAssignment(@Param("id") id: string, @Body() dto: UpdateOrgAssignmentDto) {
    const data = await this.service.updateOrgAssignment(id, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/separate")
  @HttpCode(200)
  async separate(@Param("id") id: string, @Body() dto: SeparateEmployeeDto) {
    const data = await this.service.separate(id, dto);
    return { data };
  }
}
