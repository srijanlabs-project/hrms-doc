import { Controller, Get } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { PermissionsMatrixService } from "./permissions-matrix.service";

/** W1·E03 Identity and Access — permissions matrix (read-only, real-time). */
@Roles("org_admin", "hr_ops")
@Controller("security/permissions-matrix")
export class PermissionsMatrixController {
  constructor(private readonly service: PermissionsMatrixService) {}

  @Get()
  get() {
    return { data: this.service.getMatrix() };
  }
}
