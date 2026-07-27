import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { IsBoolean } from "class-validator";
import { Roles } from "../../auth/decorators/roles.decorator";
import { GoLiveChecklistService } from "./go-live-checklist.service";

class SetChecklistItemDto {
  @IsBoolean()
  completed!: boolean;
}

/** W0·E31 Implementation and Migration — onboarding go-live checklist. */
@Roles("org_admin", "hr_ops")
@Controller("implementation/checklist")
export class GoLiveChecklistController {
  constructor(private readonly service: GoLiveChecklistService) {}

  @Get()
  async list() {
    return { data: await this.service.list() };
  }

  @Patch(":key")
  async setCompleted(@Param("key") key: string, @Body() dto: SetChecklistItemDto) {
    return { data: await this.service.setCompleted(key, dto.completed) };
  }
}
