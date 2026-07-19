import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  /** Response uses the standard single-resource envelope from appendix 17. */
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
