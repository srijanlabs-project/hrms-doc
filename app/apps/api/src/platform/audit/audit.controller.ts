import { Controller, Get, Param } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AuditService } from "./audit.service";

/** Admin-facing viewer for the Audit Engine. HTTP only — no business logic. */
@Roles("org_admin", "hr_ops")
@Controller("audit-logs")
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  async list() {
    const data = await this.service.listRecent();
    return { data };
  }

  @Get(":entityType/:entityId")
  async listForEntity(@Param("entityType") entityType: string, @Param("entityId") entityId: string) {
    const data = await this.service.listForEntity(entityType, entityId);
    return { data };
  }
}
