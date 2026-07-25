import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { DocumentGenerationService } from "./document-generation.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { GenerateDocumentDto } from "./dto/generate-document.dto";

/** HTTP only — no business logic. Document Generation + Template engines. */
@Controller()
export class DocumentGenerationController {
  constructor(private readonly service: DocumentGenerationService) {}

  @Get("document-templates")
  async listTemplates() {
    const data = await this.service.listTemplates();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("document-templates")
  @HttpCode(201)
  async createTemplate(@Body() dto: CreateTemplateDto) {
    const data = await this.service.createTemplate(dto);
    return { data };
  }

  @Get("people/employees/:employeeId/generated-documents")
  async listForEmployee(@Param("employeeId") employeeId: string) {
    const data = await this.service.listForEmployee(employeeId);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("people/employees/:employeeId/generated-documents")
  @HttpCode(201)
  async generate(@Param("employeeId") employeeId: string, @Body() dto: GenerateDocumentDto) {
    const data = await this.service.generate(employeeId, dto.templateId);
    return { data };
  }
}
