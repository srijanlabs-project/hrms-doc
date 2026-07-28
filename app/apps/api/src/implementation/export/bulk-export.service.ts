import { Injectable } from "@nestjs/common";
import { LegalEntityService } from "../../org/legal-entity/legal-entity.service";
import { DepartmentRepository } from "../../org/department/department.repository";
import { LeavePolicyService } from "../../leave/policy/leave-policy.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, ValidationAppError } from "../../platform/errors/errors";
import { EXPORTABLE_ENTITY_TYPES, EXPORT_FIELDS, type ExportableEntityType } from "./export-field-registry";

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/**
 * W0·E31 Implementation and Migration — bulk export, the read-side
 * counterpart to the import engine's IMPORTABLE_ENTITY_TYPES. Same four
 * entity types, fixed column lists (not a user-configurable field picker
 * like E25's custom-report builder — this is "give me the whole master
 * table back out", the natural symmetric operation to bulk import).
 */
@Injectable()
export class BulkExportService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly legalEntityService: LegalEntityService,
    private readonly leavePolicyService: LeavePolicyService,
    private readonly requestContext: RequestContextService,
  ) {}

  async exportCsv(entityType: ExportableEntityType): Promise<{ filename: string; csv: string }> {
    if (!EXPORTABLE_ENTITY_TYPES.includes(entityType)) {
      throw new ValidationAppError([
        { field: "entityType", code: "INVALID_ENTITY_TYPE", message: `"${entityType}" is not an exportable entity type.` },
      ]);
    }
    const rows = await this.fetchRows(entityType);
    const fields = EXPORT_FIELDS[entityType];
    const header = fields.join(",");
    const lines = rows.map((row) => fields.map((field) => csvEscape((row as Record<string, unknown>)[field])).join(","));
    return {
      filename: `${entityType.toLowerCase()}-export-${new Date().toISOString().slice(0, 10)}.csv`,
      csv: [header, ...lines].join("\n"),
    };
  }

  private async fetchRows(entityType: ExportableEntityType): Promise<Record<string, unknown>[]> {
    const tenantId = this.requireTenantId();
    switch (entityType) {
      case "Employee":
        return this.employeeRepository.findAll(tenantId);
      case "Department":
        return this.departmentRepository.findAll(tenantId);
      case "LegalEntity":
        return this.legalEntityService.list();
      case "LeavePolicy":
        return this.leavePolicyService.list();
    }
  }

  private requireTenantId(): string {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
