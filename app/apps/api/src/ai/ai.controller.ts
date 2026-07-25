import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AskAiDto } from "./dto/ask-ai.dto";

/** HTTP only — no business logic. Ridz assistant panel. Spec: 08-submodule-specifications/26-ai-and-copilot/01-hr-copilot.md */
@Controller("ai")
export class AiController {
  constructor(private readonly service: AiService) {}

  @Post("ask")
  @HttpCode(200)
  async ask(@Body() dto: AskAiDto) {
    const data = await this.service.ask(dto.message);
    return { data };
  }
}
