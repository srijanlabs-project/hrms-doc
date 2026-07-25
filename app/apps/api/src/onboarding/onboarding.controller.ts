import { Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { OnboardingService } from "./onboarding.service";

/** HTTP only — no business logic. Self-service: the joiner's own case. Spec: 08-submodule-specifications/02-people-management/09-onboarding.md */
@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}

  @Get("my")
  async getMyCase() {
    const data = await this.service.getMyCase();
    return { data };
  }

  @Post("tasks/:taskId/complete")
  @HttpCode(200)
  async completeMyTask(@Param("taskId") taskId: string) {
    const data = await this.service.completeMyTask(taskId);
    return { data };
  }
}
