import { Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { OnboardingService } from "./onboarding.service";

/** HTTP only — no business logic. HR control center: all cases. Spec: 08-submodule-specifications/02-people-management/09-onboarding.md */
@Controller("onboarding/cases")
@Roles("org_admin", "hr_ops")
export class OnboardingAdminController {
  constructor(private readonly service: OnboardingService) {}

  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Post(":id/activate")
  @HttpCode(200)
  async activate(@Param("id") id: string) {
    const data = await this.service.activate(id);
    return { data };
  }

  @Post("tasks/:taskId/waive")
  @HttpCode(200)
  async waiveTask(@Param("taskId") taskId: string) {
    const data = await this.service.waiveTask(taskId);
    return { data };
  }
}
