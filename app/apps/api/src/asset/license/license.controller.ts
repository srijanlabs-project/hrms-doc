import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AssignLicenseDto } from "./dto/assign-license.dto";
import { CreateLicenseDto } from "./dto/create-license.dto";
import { LicenseService } from "./license.service";

/** HTTP only — no business logic. Wave 4·E18 gap closure ("software licenses"). */
@Controller("assets/licenses")
export class LicenseController {
  constructor(private readonly service: LicenseService) {}

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLicenseDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("active")
  async listActive() {
    const data = await this.service.listActive();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("assign")
  @HttpCode(201)
  async assign(@Body() dto: AssignLicenseDto) {
    const data = await this.service.assign(dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("assignments/:id/revoke")
  @HttpCode(200)
  async revoke(@Param("id") id: string) {
    const data = await this.service.revoke(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("assignments/all")
  async listAllAssignments() {
    const data = await this.service.listAllAssignments();
    return { data };
  }

  @Get("assignments/my")
  async listMyAssignments() {
    const data = await this.service.listMyAssignments();
    return { data };
  }
}
