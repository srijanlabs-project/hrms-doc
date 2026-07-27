import { Controller, Get, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { BackupService } from "./backup.service";

/** W0·E30 DevOps and Operations — admin-facing backup console. */
@Roles("org_admin", "hr_ops")
@Controller("ops/backups")
export class BackupController {
  constructor(private readonly service: BackupService) {}

  @Post()
  async runNow() {
    return { data: await this.service.runNow() };
  }

  @Get()
  async list() {
    return { data: await this.service.listRecords() };
  }

  @Get(":id/preview")
  async preview(@Param("id") id: string) {
    return { data: await this.service.previewRestore(id) };
  }
}
