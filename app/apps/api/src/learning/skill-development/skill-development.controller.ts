import { Controller, Get } from "@nestjs/common";
import { SkillDevelopmentService } from "./skill-development.service";

/** HTTP only — no business logic. W3·E12 gap closure: skill development. */
@Controller("learning/skill-development")
export class SkillDevelopmentController {
  constructor(private readonly service: SkillDevelopmentService) {}

  @Get("mine")
  async getMine() {
    const data = await this.service.getMine();
    return { data };
  }
}
