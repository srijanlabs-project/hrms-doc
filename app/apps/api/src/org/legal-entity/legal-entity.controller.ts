import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { CreateLegalEntityDto } from "./dto/create-legal-entity.dto";
import { LegalEntityService } from "./legal-entity.service";

/** HTTP only — no business logic. Envelope shapes per appendix 28 §2. */
@Controller("org/legal-entities")
export class LegalEntityController {
  constructor(private readonly service: LegalEntityService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLegalEntityDto) {
    const data = await this.service.create(dto);
    return { data };
  }
}
