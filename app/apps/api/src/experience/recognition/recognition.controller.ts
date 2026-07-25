import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { GiveRecognitionDto } from "./dto/give-recognition.dto";
import { RecognitionService } from "./recognition.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/15-employee-experience.md */
@Controller("experience/recognitions")
export class RecognitionController {
  constructor(private readonly service: RecognitionService) {}

  @Post()
  @HttpCode(201)
  async give(@Body() dto: GiveRecognitionDto) {
    const data = await this.service.give(dto);
    return { data };
  }

  @Get("feed")
  async feed() {
    const data = await this.service.feed();
    return { data };
  }

  @Get("received")
  async listReceivedByMe() {
    const data = await this.service.listReceivedByMe();
    return { data };
  }

  @Get("given")
  async listGivenByMe() {
    const data = await this.service.listGivenByMe();
    return { data };
  }
}
