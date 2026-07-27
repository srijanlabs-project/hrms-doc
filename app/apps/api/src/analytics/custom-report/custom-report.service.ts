import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { CustomReportRepository } from "./custom-report.repository";
import { REPORT_FIELD_REGISTRY, REPORTABLE_ENTITY_TYPES, type ReportableEntityType } from "./field-registry";

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

interface RunInput {
  entityType: ReportableEntityType;
  selectedFields: string[];
  filters?: Record<string, string | number | boolean>;
}

/**
 * W5·E25 Analytics and BI — custom-report builder. Read-side analog of
 * ImplementationModule's ImportEngineService: a per-entity-type allowlist
 * registry (field-registry.ts) instead of duplicating a query builder per
 * module. Saved definitions (ReportDefinition) are optional — callers can
 * also run an ad-hoc query without saving it first.
 */
@Injectable()
export class CustomReportService {
  constructor(
    private readonly repository: CustomReportRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  listEntityTypes() {
    return REPORTABLE_ENTITY_TYPES.map((entityType) => ({
      entityType,
      fields: REPORT_FIELD_REGISTRY[entityType],
    }));
  }

  async listDefinitions() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAllDefinitions(tenantId);
  }

  async createDefinition(input: RunInput & { name: string }) {
    const { tenantId, userId } = this.requireAuthenticatedWithUser();
    this.validateFields(input.entityType, input.selectedFields, input.filters);
    return this.repository.createDefinition(tenantId, {
      name: input.name,
      entityType: input.entityType,
      selectedFields: input.selectedFields,
      filters: input.filters,
      createdByUserId: userId,
    });
  }

  async deleteDefinition(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const definition = await this.repository.findDefinitionById(tenantId, id);
    if (!definition) {
      throw new NotFoundAppError("OBJ-REPORT-DEFINITION", "Report definition not found.");
    }
    await this.repository.deleteDefinition(tenantId, id);
  }

  async runAdHoc(input: RunInput) {
    const { tenantId } = this.requireAuthenticated();
    this.validateFields(input.entityType, input.selectedFields, input.filters);
    return this.repository.runQuery(tenantId, input.entityType, input.selectedFields, input.filters ?? {});
  }

  async runSaved(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const definition = await this.repository.findDefinitionById(tenantId, id);
    if (!definition) {
      throw new NotFoundAppError("OBJ-REPORT-DEFINITION", "Report definition not found.");
    }
    const entityType = definition.entityType as ReportableEntityType;
    const filters = (definition.filters as Record<string, string | number | boolean> | null) ?? {};
    const rows = await this.repository.runQuery(tenantId, entityType, definition.selectedFields, filters);
    return { definition, rows };
  }

  async exportCsv(input: RunInput): Promise<{ filename: string; csv: string }> {
    const rows = await this.runAdHoc(input);
    const header = input.selectedFields.join(",");
    const lines = rows.map((row) => input.selectedFields.map((field) => csvEscape(row[field])).join(","));
    return {
      filename: `${input.entityType.toLowerCase()}-report-${new Date().toISOString().slice(0, 10)}.csv`,
      csv: [header, ...lines].join("\n"),
    };
  }

  private validateFields(
    entityType: ReportableEntityType,
    selectedFields: string[],
    filters?: Record<string, unknown>,
  ) {
    const allowed = new Set(REPORT_FIELD_REGISTRY[entityType]);
    const invalidFields = selectedFields.filter((field) => !allowed.has(field));
    const invalidFilterKeys = Object.keys(filters ?? {}).filter((key) => !allowed.has(key));

    if (selectedFields.length === 0 || invalidFields.length > 0 || invalidFilterKeys.length > 0) {
      throw new ValidationAppError([
        ...invalidFields.map((field) => ({
          field: "selectedFields",
          code: "INVALID_FIELD",
          message: `"${field}" is not a reportable field for ${entityType}.`,
        })),
        ...invalidFilterKeys.map((key) => ({
          field: "filters",
          code: "INVALID_FIELD",
          message: `"${key}" is not a reportable field for ${entityType}.`,
        })),
        ...(selectedFields.length === 0
          ? [{ field: "selectedFields", code: "REQUIRED", message: "Select at least one field." }]
          : []),
      ]);
    }
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }

  private requireAuthenticatedWithUser(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
