import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateLearningPathDto } from "./dto/create-path.dto";
import { LearningPathService } from "./learning-path.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. W3·E12 gap closure: learning paths. */
@Controller("learning/paths")
export class LearningPathController {
  constructor(private readonly service: LearningPathService) {}

  @Get()
  async listCatalog() {
    const data = await this.service.listCatalog();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("admin")
  async listAllAdmin() {
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLearningPathDto) {
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

  @Post(":id/enroll")
  @HttpCode(201)
  async enroll(@Param("id") id: string) {
    const data = await this.service.enroll(id);
    return { data };
  }
}
