import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { REPORT_ROW_LIMIT, type ReportableEntityType } from "./field-registry";

export interface SaveReportDefinitionInput {
  name: string;
  entityType: ReportableEntityType;
  selectedFields: string[];
  filters?: Record<string, unknown> | null;
  createdByUserId: string;
}

@Injectable()
export class CustomReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllDefinitions(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.reportDefinition.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    );
  }

  findDefinitionById(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.reportDefinition.findFirst({ where: { id, tenantId } }));
  }

  createDefinition(tenantId: string, input: SaveReportDefinitionInput) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.reportDefinition.create({
        data: {
          tenantId,
          name: input.name,
          entityType: input.entityType,
          selectedFields: input.selectedFields,
          filters: (input.filters as Prisma.InputJsonValue) ?? undefined,
          createdByUserId: input.createdByUserId,
        },
      }),
    );
  }

  deleteDefinition(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.reportDefinition.delete({ where: { id } }));
  }

  runQuery(
    tenantId: string,
    entityType: ReportableEntityType,
    selectedFields: string[],
    filters: Record<string, string | number | boolean>,
  ): Promise<Record<string, unknown>[]> {
    const select: Record<string, boolean> = {};
    for (const field of selectedFields) {
      select[field] = true;
    }
    const where = { tenantId, ...filters };

    return this.prisma.withTenant(tenantId, (tx) => {
      switch (entityType) {
        case "Employee":
          return tx.employee.findMany({ where: { ...where, deletedAt: null }, select, take: REPORT_ROW_LIMIT });
        case "LeaveRequest":
          return tx.leaveRequest.findMany({ where: { ...where, deletedAt: null }, select, take: REPORT_ROW_LIMIT });
        case "PayrollRunResult":
          return tx.payrollRunResult.findMany({ where, select, take: REPORT_ROW_LIMIT });
      }
    });
  }
}
