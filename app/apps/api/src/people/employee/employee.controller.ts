import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
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

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateEmployeeDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
