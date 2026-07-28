import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateWellnessProgramDto } from "./dto/create-wellness-program.dto";
import { WellnessService } from "./wellness.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Wave 4 W4·E15 gap closure: wellness programs. */
@Controller("experience/wellness-programs")
export class WellnessController {
  constructor(private readonly service: WellnessService) {}

  @Get()
  async listAll() {
    const data = await this.service.listAllWithEnrollment();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateWellnessProgramDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/enroll")
  @HttpCode(201)
  async enroll(@Param("id") id: string) {
    const data = await this.service.enroll(id);
    return { data };
  }
}
