import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { CompanySetupRepository, type CodeIndex } from "./company-setup.repository";
import type {
  SetupEmployeesDto,
  SetupManagersDto,
  SetupSalaryDto,
  SetupStructureDto,
} from "./dto/setup-steps.dto";

export interface RowResult {
  entity: string;
  code: string;
  success: boolean;
  error?: string;
}

export interface StepResult {
  dryRun: boolean;
  total: number;
  succeeded: number;
  failed: number;
  results: RowResult[];
}

/** Sorts department rows so a parent always precedes its children, letting one payload declare a whole hierarchy in any order. Rows whose parentCode isn't in this payload (i.e. an already-created parent, or a bad reference) come first and are resolved/failed against the database index. */
function topoSortDepartments<T extends { code: string; parentCode?: string }>(rows: T[]): T[] {
  const byCode = new Map(rows.map((r) => [r.code, r]));
  const sorted: T[] = [];
  const state = new Map<string, "visiting" | "done">();

  const visit = (row: T) => {
    const s = state.get(row.code);
    if (s === "done") return;
    // A cycle can't be ordered — emit as-is and let the FK/parent resolution report the failure per row.
    if (s === "visiting") return;
    state.set(row.code, "visiting");
    if (row.parentCode) {
      const parent = byCode.get(row.parentCode);
      if (parent) visit(parent);
    }
    state.set(row.code, "done");
    sorted.push(row);
  };

  rows.forEach(visit);
  return sorted;
}

function errText(err: unknown): string {
  if (typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002") {
    return "Already exists (duplicate code)";
  }
  return err instanceof Error ? err.message : "Unknown error";
}

/**
 * Staged company setup — the migration/onboarding path that the raw import
 * engine can't serve well, because every relationship field there is a UUID
 * and a person preparing a file has no way to know them in advance.
 *
 * Four steps, each independently validated and committed:
 *   1. Structure  — departments (with hierarchy), designations, grades
 *   2. Employees  — details only, linked to structure by code
 *   3. Managers   — reporting lines, once every employee exists
 *   4. Salary     — compensation per employee
 *
 * Splitting them is the point: a company's structure can be loaded and
 * eyeballed before a single employee lands, and reporting lines are applied
 * only when both ends of every edge are resolvable. Nothing about the stored
 * model changes — codes exist purely as transport inside the payload, and
 * every FK written is the same UUID it always was.
 *
 * Every step supports dryRun, which resolves and validates each row exactly
 * as a real run would but writes nothing, so a migration can be rehearsed
 * end to end before committing.
 */
@Injectable()
export class CompanySetupService {
  constructor(
    private readonly repository: CompanySetupRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  status() {
    return this.repository.counts(this.tenantId);
  }

  async applyStructure(dto: SetupStructureDto): Promise<StepResult> {
    const tenantId = this.tenantId;
    const dryRun = dto.dryRun ?? false;
    const results: RowResult[] = [];

    const deptIndex = await this.repository.indexDepartments(tenantId);
    for (const row of topoSortDepartments(dto.departments ?? [])) {
      results.push(
        await this.runRow("Department", row.code, async () => {
          if (deptIndex.has(row.code)) throw new Error("Already exists (duplicate code)");
          let parentDepartmentId: string | undefined;
          if (row.parentCode) {
            parentDepartmentId = deptIndex.get(row.parentCode);
            if (!parentDepartmentId) throw new Error(`Parent department "${row.parentCode}" not found`);
          }
          if (dryRun) {
            // Register it so later rows in this same payload can still resolve it as a parent.
            deptIndex.set(row.code, "dry-run");
            return;
          }
          const created = await this.repository.createDepartment(tenantId, {
            code: row.code,
            name: row.name,
            parentDepartmentId,
          });
          deptIndex.set(row.code, created.id);
        }),
      );
    }

    const desigIndex = await this.repository.indexDesignations(tenantId);
    for (const row of dto.designations ?? []) {
      results.push(
        await this.runRow("Designation", row.code, async () => {
          if (desigIndex.has(row.code)) throw new Error("Already exists (duplicate code)");
          if (dryRun) return void desigIndex.set(row.code, "dry-run");
          const created = await this.repository.createDesignation(tenantId, {
            code: row.code,
            title: row.title,
            careerTrack: row.careerTrack ?? "IC",
          });
          desigIndex.set(row.code, created.id);
        }),
      );
    }

    const gradeIndex = await this.repository.indexGrades(tenantId);
    for (const row of dto.grades ?? []) {
      results.push(
        await this.runRow("Grade", row.code, async () => {
          if (gradeIndex.has(row.code)) throw new Error("Already exists (duplicate code)");
          if (dryRun) return void gradeIndex.set(row.code, "dry-run");
          const created = await this.repository.createGrade(tenantId, {
            code: row.code,
            name: row.name,
            band: row.band,
          });
          gradeIndex.set(row.code, created.id);
        }),
      );
    }

    return this.summarise(dryRun, results);
  }

  async applyEmployees(dto: SetupEmployeesDto): Promise<StepResult> {
    const tenantId = this.tenantId;
    const dryRun = dto.dryRun ?? false;
    const [empIndex, deptIndex, desigIndex, gradeIndex] = await Promise.all([
      this.repository.indexEmployees(tenantId),
      this.repository.indexDepartments(tenantId),
      this.repository.indexDesignations(tenantId),
      this.repository.indexGrades(tenantId),
    ]);
    const results: RowResult[] = [];

    for (const row of dto.employees) {
      results.push(
        await this.runRow("Employee", row.employeeCode, async () => {
          if (empIndex.has(row.employeeCode)) throw new Error("Already exists (duplicate employee code)");
          const departmentId = this.resolve(deptIndex, row.departmentCode, "Department");
          const designationId = this.resolve(desigIndex, row.designationCode, "Designation");
          const gradeId = this.resolve(gradeIndex, row.gradeCode, "Grade");
          if (dryRun) return void empIndex.set(row.employeeCode, "dry-run");
          const created = await this.repository.createEmployee(tenantId, {
            employeeCode: row.employeeCode,
            legalName: row.legalName,
            personalEmail: row.personalEmail,
            mobileNumber: row.mobileNumber,
            dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : undefined,
            joiningDate: row.joiningDate ? new Date(row.joiningDate) : undefined,
            departmentId,
            designationId,
            gradeId,
          });
          empIndex.set(row.employeeCode, created.id);
        }),
      );
    }

    return this.summarise(dryRun, results);
  }

  async applyManagers(dto: SetupManagersDto): Promise<StepResult> {
    const tenantId = this.tenantId;
    const dryRun = dto.dryRun ?? false;
    const empIndex = await this.repository.indexEmployees(tenantId);
    const results: RowResult[] = [];

    for (const row of dto.mappings) {
      results.push(
        await this.runRow("ManagerMapping", row.employeeCode, async () => {
          if (row.employeeCode === row.managerEmployeeCode) throw new Error("An employee cannot report to themselves");
          const employeeId = empIndex.get(row.employeeCode);
          if (!employeeId) throw new Error(`Employee "${row.employeeCode}" not found`);
          const managerId = empIndex.get(row.managerEmployeeCode);
          if (!managerId) throw new Error(`Manager "${row.managerEmployeeCode}" not found`);
          if (dryRun) return;
          const count = await this.repository.setManager(tenantId, employeeId, managerId);
          if (count === 0) throw new Error("Employee not found");
        }),
      );
    }

    return this.summarise(dryRun, results);
  }

  async applySalary(dto: SetupSalaryDto): Promise<StepResult> {
    const tenantId = this.tenantId;
    const dryRun = dto.dryRun ?? false;
    const empIndex = await this.repository.indexEmployees(tenantId);
    const results: RowResult[] = [];

    for (const row of dto.salaries) {
      results.push(
        await this.runRow("Salary", row.employeeCode, async () => {
          const employeeId = empIndex.get(row.employeeCode);
          if (!employeeId) throw new Error(`Employee "${row.employeeCode}" not found`);
          if (dryRun) return;
          await this.repository.upsertCompensation(
            tenantId,
            employeeId,
            row.monthlyBasic,
            new Date(row.effectiveFrom),
          );
        }),
      );
    }

    return this.summarise(dryRun, results);
  }

  private resolve(index: CodeIndex, code: string | undefined, label: string): string | undefined {
    if (!code) return undefined;
    const id = index.get(code);
    if (!id) throw new Error(`${label} "${code}" not found`);
    // A dry run has no real id yet; the caller writes nothing, so the placeholder never reaches the database.
    return id === "dry-run" ? undefined : id;
  }

  /** One row never fails the batch — a 50-person migration reports every bad row in one pass instead of stopping at the first. */
  private async runRow(entity: string, code: string, fn: () => Promise<void>): Promise<RowResult> {
    try {
      await fn();
      return { entity, code, success: true };
    } catch (err) {
      return { entity, code, success: false, error: errText(err) };
    }
  }

  private summarise(dryRun: boolean, results: RowResult[]): StepResult {
    const succeeded = results.filter((r) => r.success).length;
    return { dryRun, total: results.length, succeeded, failed: results.length - succeeded, results };
  }
}
