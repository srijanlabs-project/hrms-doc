import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { CreateKeyResultDto } from "./dto/create-key-result.dto";
import { UpdateKeyResultValueDto } from "./dto/update-key-result-value.dto";
import { KeyResultService } from "./keyresult.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/11-performance-management.md */
@Controller("performance/key-results")
export class KeyResultController {
  constructor(private readonly service: KeyResultService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateKeyResultDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/value")
  @HttpCode(200)
  async updateValue(@Param("id") id: string, @Body() dto: UpdateKeyResultValueDto) {
    const data = await this.service.updateValue(id, dto.currentValue);
    return { data };
  }
}
