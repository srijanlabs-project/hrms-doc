import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { DepartmentService } from "./department.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/01-organization-management/03-department.md */
@Controller("org/departments")
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateDepartmentDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
