import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";

@Controller("health")
export class HealthController {
  /** Response uses the standard single-resource envelope from appendix 17. */
  @Public()
  @Get()
  getHealth() {
    return {
      data: {
        service: "staffsy-api",
        status: "up",
        time: new Date().toISOString(),
      },
    };
  }
}
