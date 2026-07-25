import { Controller, Get } from "@nestjs/common";
import { AllowSeparated } from "../auth/decorators/allow-separated.decorator";
import { ExitService } from "./exit.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/02-people-management/13-exit.md */
@Controller("exit")
export class ExitController {
  constructor(private readonly service: ExitService) {}

  @AllowSeparated()
  @Get("me")
  async getMine() {
    const data = await this.service.getMine();
    return { data };
  }
}
