import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateKnowledgeArticleDto } from "./dto/create-knowledge-article.dto";
import { KnowledgeArticleService } from "./knowledge-article.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/19-helpdesk-case-management.md */
@Controller("helpdesk/knowledge-articles")
export class KnowledgeArticleController {
  constructor(private readonly service: KnowledgeArticleService) {}

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateKnowledgeArticleDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get()
  async listPublished(@Query("queue") queue?: string) {
    const data = await this.service.listPublished(queue);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("admin")
  async listAllAdmin() {
    const data = await this.service.listAllAdmin();
    return { data };
  }
}
