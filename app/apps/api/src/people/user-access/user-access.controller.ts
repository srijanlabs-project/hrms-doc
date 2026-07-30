import { Body, Controller, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ProvisionLoginDto } from "./dto/provision-login.dto";
import { UpdateRolesDto } from "./dto/update-roles.dto";
import { UserAccessService } from "./user-access.service";

/** HTTP only — no business logic. Admin-gated: granting sign-in access and changing roles are both privilege operations. */
@Roles("org_admin", "hr_ops")
@Controller("people/user-access")
export class UserAccessController {
  constructor(private readonly service: UserAccessService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Post("provision-missing")
  @HttpCode(200)
  async provisionMissing(@Body() dto: ProvisionLoginDto) {
    const data = await this.service.provisionMissing(dto.roles);
    return { data };
  }

  @Post("employees/:employeeId")
  @HttpCode(201)
  async provisionOne(@Param("employeeId") employeeId: string, @Body() dto: ProvisionLoginDto) {
    const data = await this.service.provisionOne(employeeId, dto.roles);
    return { data };
  }

  @Patch("users/:userId/roles")
  @HttpCode(200)
  async updateRoles(@Param("userId") userId: string, @Body() dto: UpdateRolesDto) {
    const data = await this.service.updateRoles(userId, dto.roles);
    return { data };
  }
}
