import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { Prisma } from "@prisma/client";
import { DepartmentService } from "../../org/department/department.service";
import { CreateDepartmentDto } from "../../org/department/dto/create-department.dto";
import { LegalEntityService } from "../../org/legal-entity/legal-entity.service";
import { CreateLegalEntityDto } from "../../org/legal-entity/dto/create-legal-entity.dto";
import { LeavePolicyService } from "../../leave/policy/leave-policy.service";
import { CreateLeavePolicyDto } from "../../leave/policy/dto/create-leave-policy.dto";
import { EmployeeService } from "../../people/employee/employee.service";
import { CreateEmployeeDto } from "../../people/employee/dto/create-employee.dto";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError } from "../../platform/errors/errors";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { ImportBatchRepository } from "./import-batch.repository";

/**
 * A generic multi-entity import engine (E31 Implementation and Migration):
 * one configurable surface for legacy-system data migration across modules,
 * reusing each module's existing create(dto) service rather than a parallel
 * per-entity bulk path — the same row-validate-partial-success pattern
 * EmployeeService.bulkCreate already established, generalized.
 */
export const IMPORTABLE_ENTITY_TYPES = ["Employee", "Department", "LegalEntity", "LeavePolicy"] as const;
export type ImportableEntityType = (typeof IMPORTABLE_ENTITY_TYPES)[number];

export interface ImportRowResult {
  index: number;
  success: boolean;
  error?: string;
  label?: string;
  createdEntityId?: string;
}

function stateConflict(message: string) {
  return new AppError({
    errorRef: "ERR-IMPORT-BATCH-001",
    code: "IMPORT-BATCH-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-IMPORT-BATCH",
  });
}

interface EntityDefinition {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dtoClass: new () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (dto: any) => Promise<{ id: string; label: string }>;
}

@Injectable()
export class ImportEngineService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly departmentService: DepartmentService,
    private readonly legalEntityService: LegalEntityService,
    private readonly leavePolicyService: LeavePolicyService,
    private readonly repository: ImportBatchRepository,
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  private getDefinition(entityType: ImportableEntityType): EntityDefinition {
    switch (entityType) {
      case "Employee":
        return {
          dtoClass: CreateEmployeeDto,
          create: async (dto: CreateEmployeeDto) => {
            const created = await this.employeeService.create(dto);
            return { id: created.id, label: created.employeeCode };
          },
        };
      case "Department":
        return {
          dtoClass: CreateDepartmentDto,
          create: async (dto: CreateDepartmentDto) => {
            const created = await this.departmentService.create(dto);
            return { id: created.id, label: created.code };
          },
        };
      case "LegalEntity":
        return {
          dtoClass: CreateLegalEntityDto,
          create: async (dto: CreateLegalEntityDto) => {
            const created = await this.legalEntityService.create(dto);
            return { id: created.id, label: created.code };
          },
        };
      case "LeavePolicy":
        return {
          dtoClass: CreateLeavePolicyDto,
          create: async (dto: CreateLeavePolicyDto) => {
            const created = await this.leavePolicyService.create(dto);
            return { id: created.id, label: created.name };
          },
        };
    }
  }

  async processRows(entityType: ImportableEntityType, rows: Record<string, unknown>[], dryRun: boolean) {
    const definition = this.getDefinition(entityType);
    const results: ImportRowResult[] = [];

    for (let index = 0; index < rows.length; index++) {
      const dto = plainToInstance(definition.dtoClass, rows[index]);
      const validationErrors = await validate(dto);
      if (validationErrors.length > 0) {
        const message = validationErrors.flatMap((e) => Object.values(e.constraints ?? {})).join("; ");
        results.push({ index, success: false, error: message });
        continue;
      }
      if (dryRun) {
        results.push({ index, success: true });
        continue;
      }
      try {
        const created = await definition.create(dto);
        results.push({ index, success: true, label: created.label, createdEntityId: created.id });
      } catch (err) {
        results.push({ index, success: false, error: err instanceof AppError ? err.message : "Unknown error" });
      }
    }

    if (dryRun) {
      return { dryRun: true as const, results };
    }

    const successCount = results.filter((r) => r.success).length;
    const batch = await this.repository.createBatch(this.tenantId, {
      entityType,
      totalRows: rows.length,
      successCount,
      failureCount: rows.length - successCount,
      triggeredByUserId: this.requestContext.userId!,
      rows: results,
    });
    return { dryRun: false as const, batch };
  }

  listBatches() {
    return this.repository.findAll(this.tenantId);
  }

  async getBatch(id: string) {
    const batch = await this.repository.findById(this.tenantId, id);
    if (!batch) {
      throw new NotFoundAppError("OBJ-IMPORT-BATCH", "Import batch not found.");
    }
    return batch;
  }

  /** Undoes a committed batch by soft-deleting the rows it created — not a hard delete, so it's itself reversible at the data layer if needed. */
  async rollback(id: string) {
    const batch = await this.getBatch(id);
    if (batch.status === "RolledBack") {
      throw stateConflict("This batch has already been rolled back.");
    }

    await this.prisma.withTenant(this.tenantId, async (tx) => {
      for (const row of batch.rows) {
        if (row.success && row.createdEntityId) {
          await this.softDeleteEntity(tx, batch.entityType as ImportableEntityType, row.createdEntityId);
        }
      }
    });

    return this.repository.markRolledBack(this.tenantId, id);
  }

  private async softDeleteEntity(tx: Prisma.TransactionClient, entityType: ImportableEntityType, id: string): Promise<void> {
    const data = { deletedAt: new Date() };
    switch (entityType) {
      case "Employee":
        await tx.employee.update({ where: { id }, data });
        break;
      case "Department":
        await tx.department.update({ where: { id }, data });
        break;
      case "LegalEntity":
        await tx.legalEntity.update({ where: { id }, data });
        break;
      case "LeavePolicy":
        await tx.leavePolicy.update({ where: { id }, data });
        break;
    }
  }
}
