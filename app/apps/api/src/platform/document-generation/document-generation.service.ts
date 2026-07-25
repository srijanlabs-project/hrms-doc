import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../context/request-context.service";
import { AuthenticationAppError, NotFoundAppError } from "../errors/errors";
import { FilesService } from "../files/files.service";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateTemplateDto } from "./dto/create-template.dto";
import { DocumentTemplateRepository } from "./document-template.repository";
import { GeneratedDocumentRepository } from "./generated-document.repository";

function renderTemplate(body: string, fields: Record<string, string>): string {
  return body.replace(/{{\s*(\w+)\s*}}/g, (match, key: string) => fields[key] ?? match);
}

/**
 * Document Generation + Template engines (Foundation & Platform, E00) — the
 * first real consumer of the "Generate Letter" quick action stubbed on the
 * Employee 360 page since Phase 2. Plain-text {{mergeField}} substitution
 * only — no PDF rendering or rich layout, and no e-signature (stays backlog).
 */
@Injectable()
export class DocumentGenerationService {
  constructor(
    private readonly templates: DocumentTemplateRepository,
    private readonly generatedDocuments: GeneratedDocumentRepository,
    private readonly files: FilesService,
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async listTemplates() {
    return this.templates.findAll(this.requireTenantId());
  }

  async createTemplate(dto: CreateTemplateDto) {
    return this.templates.create(this.requireTenantId(), dto);
  }

  async listForEmployee(employeeId: string) {
    return this.generatedDocuments.findForEmployee(this.requireTenantId(), employeeId);
  }

  /** extraFields lets callers (e.g. PayrollDocumentService) merge in context beyond the base Employee record — overrides base fields on key collision. */
  async generate(employeeId: string, templateId: string, extraFields: Record<string, string> = {}) {
    const { tenantId, userId } = this.requireAuthenticated();
    const template = await this.templates.findById(tenantId, templateId);
    if (!template) {
      throw new NotFoundAppError("OBJ-DOCUMENT-TEMPLATE", "Template not found.");
    }
    const employee = await this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.findFirst({
        where: { id: employeeId, tenantId },
        include: { department: true, designation: true },
      }),
    );
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }

    const rendered = renderTemplate(template.bodyTemplate, {
      employeeName: employee.legalName,
      employeeCode: employee.employeeCode,
      department: employee.department?.name ?? "—",
      designation: employee.designation?.title ?? "—",
      joiningDate: employee.joiningDate ? employee.joiningDate.toISOString().slice(0, 10) : "—",
      today: new Date().toISOString().slice(0, 10),
      ...extraFields,
    });

    const buffer = Buffer.from(rendered, "utf-8");
    const file = await this.files.upload({
      originalname: `${template.name.replace(/\s+/g, "_")}-${employee.employeeCode}.txt`,
      mimetype: "text/plain",
      size: buffer.length,
      buffer,
    });

    return this.generatedDocuments.create(tenantId, {
      templateId,
      employeeId,
      fileId: file.id,
      generatedByUserId: userId,
    });
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
