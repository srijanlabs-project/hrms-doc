import { Injectable } from "@nestjs/common";
import type { Prisma, SafetyIncident } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type SafetyIncidentWithReporter = SafetyIncident & {
  reportedByEmployee: { id: string; legalName: string; employeeCode: string };
};

const includeReporter = {
  reportedByEmployee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.SafetyIncidentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class SafetyIncidentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.SafetyIncidentUncheckedCreateInput, "tenantId">,
  ): Promise<SafetyIncidentWithReporter> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyIncident.create({ data: { ...data, tenantId }, include: includeReporter }),
    );
  }

  findById(tenantId: string, id: string): Promise<SafetyIncidentWithReporter | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyIncident.findFirst({ where: { id, tenantId }, include: includeReporter }),
    );
  }

  findForReporter(tenantId: string, reportedByEmployeeId: string): Promise<SafetyIncidentWithReporter[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyIncident.findMany({
        where: { tenantId, reportedByEmployeeId },
        include: includeReporter,
        orderBy: { incidentDate: "desc" },
      }),
    );
  }

  findAll(tenantId: string, status?: string): Promise<SafetyIncidentWithReporter[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyIncident.findMany({ where: { tenantId, status }, include: includeReporter, orderBy: { incidentDate: "desc" } }),
    );
  }

  async transition(tenantId: string, id: string, fromStatuses: string[], data: Partial<SafetyIncident>): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.safetyIncident.updateMany({ where: { id, tenantId, status: { in: fromStatuses } }, data }),
    );
    return result.count;
  }
}
