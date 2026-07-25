import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Spec: 08-submodule-specifications/12-learning-and-development/01-learning-management-system.md */
@Controller("learning/courses")
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Get()
  async listCatalog() {
    const data = await this.service.listCatalog();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("admin")
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateCourseDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post(":id/publish")
  @HttpCode(200)
  async publish(@Param("id") id: string) {
    const data = await this.service.publish(id);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post(":id/archive")
  @HttpCode(200)
  async archive(@Param("id") id: string) {
    const data = await this.service.archive(id);
    return { data };
  }
}
