import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AddSuccessorDto } from "./dto/add-successor.dto";
import { CreateCriticalRoleDto } from "./dto/create-critical-role.dto";
import { UpdateSuccessorDto } from "./dto/update-successor.dto";
import { SuccessionService } from "./succession.service";

/**
 * HTTP only — no business logic. Spec: 08-submodule-specifications/13-talent-management/01-succession-planning.md.
 * Confidential per the spec — org_admin/hr_ops only, no employee self-service.
 */
@Controller("talent/succession")
@Roles("org_admin", "hr_ops")
export class SuccessionController {
  constructor(private readonly service: SuccessionService) {}

  @Get("roles")
  async listRoles(@Query("includeInactive") includeInactive?: string) {
    const data = await this.service.listRoles(includeInactive !== "true");
    return { data };
  }

  @Post("roles")
  @HttpCode(201)
  async createRole(@Body() dto: CreateCriticalRoleDto) {
    const data = await this.service.createRole(dto);
    return { data };
  }

  @Post("roles/:id/deactivate")
  @HttpCode(200)
  async deactivateRole(@Param("id") id: string) {
    const data = await this.service.deactivateRole(id);
    return { data };
  }

  @Post("roles/:id/successors")
  @HttpCode(201)
  async addSuccessor(@Param("id") id: string, @Body() dto: AddSuccessorDto) {
    const data = await this.service.addSuccessor(id, dto);
    return { data };
  }

  @Post("successors/:id")
  @HttpCode(200)
  async updateSuccessor(@Param("id") id: string, @Body() dto: UpdateSuccessorDto) {
    const data = await this.service.updateSuccessor(id, dto);
    return { data };
  }

  @Post("successors/:id/remove")
  @HttpCode(200)
  async removeSuccessor(@Param("id") id: string) {
    const data = await this.service.removeSuccessor(id);
    return { data };
  }

  @Post("run-now")
  @HttpCode(200)
  async runNow() {
    await this.service.runNow();
    return { data: { triggered: true } };
  }
}
