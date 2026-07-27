import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { ImportRowResult } from "./import-engine.service";

export interface CreateImportBatchInput {
  entityType: string;
  totalRows: number;
  successCount: number;
  failureCount: number;
  triggeredByUserId: string;
  rows: ImportRowResult[];
}

@Injectable()
export class ImportBatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  createBatch(tenantId: string, input: CreateImportBatchInput) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.importBatch.create({
        data: {
          tenantId,
          entityType: input.entityType,
          totalRows: input.totalRows,
          successCount: input.successCount,
          failureCount: input.failureCount,
          triggeredByUserId: input.triggeredByUserId,
          rows: {
            create: input.rows.map((row) => ({
              tenantId,
              rowIndex: row.index,
              success: row.success,
              errorMessage: row.error,
              createdEntityId: row.createdEntityId,
            })),
          },
        },
        include: { rows: { orderBy: { rowIndex: "asc" } } },
      }),
    );
  }

  findAll(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.importBatch.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.importBatch.findFirst({ where: { id, tenantId }, include: { rows: { orderBy: { rowIndex: "asc" } } } }),
    );
  }

  markRolledBack(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.importBatch.update({ where: { id }, data: { status: "RolledBack", rolledBackAt: new Date() } }),
    );
  }
}
