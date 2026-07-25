import { Injectable } from "@nestjs/common";
import type { CriticalRole, Prisma, SuccessionSuccessor } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type SuccessorWithEmployee = SuccessionSuccessor & {
  employee: { id: string; legalName: string; employeeCode: string };
};

export type CriticalRoleWithRefs = CriticalRole & {
  department: { id: string; name: string } | null;
  incumbent: { id: string; legalName: string } | null;
  successors: SuccessorWithEmployee[];
};

const includeRefs = {
  department: { select: { id: true, name: true } },
  incumbent: { select: { id: true, legalName: true } },
  successors: { include: { employee: { select: { id: true, legalName: true, employeeCode: true } } } },
} satisfies Prisma.CriticalRoleInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class SuccessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  createRole(
    tenantId: string,
    data: Omit<Prisma.CriticalRoleUncheckedCreateInput, "tenantId">,
  ): Promise<CriticalRoleWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.criticalRole.create({ data: { ...data, tenantId }, include: includeRefs }),
    );
  }

  findRoles(tenantId: string, activeOnly = true): Promise<CriticalRoleWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.criticalRole.findMany({
        where: { tenantId, ...(activeOnly ? { isActive: true } : {}) },
        include: includeRefs,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findRoleById(tenantId: string, id: string): Promise<CriticalRoleWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.criticalRole.findFirst({ where: { id, tenantId }, include: includeRefs }),
    );
  }

  setRoleActive(tenantId: string, id: string, isActive: boolean): Promise<CriticalRole> {
    return this.prisma.withTenant(tenantId, (tx) => tx.criticalRole.update({ where: { id }, data: { isActive } }));
  }

  addSuccessor(
    tenantId: string,
    criticalRoleId: string,
    data: { employeeId: string; readiness?: string; isEmergency?: boolean; notes?: string; createdByUserId: string },
  ): Promise<SuccessorWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.successionSuccessor.create({
        data: { ...data, criticalRoleId, tenantId },
        include: { employee: { select: { id: true, legalName: true, employeeCode: true } } },
      }),
    );
  }

  findSuccessorById(tenantId: string, id: string): Promise<SuccessorWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.successionSuccessor.findFirst({
        where: { id, tenantId },
        include: { employee: { select: { id: true, legalName: true, employeeCode: true } } },
      }),
    );
  }

  updateSuccessor(
    tenantId: string,
    id: string,
    data: Partial<Pick<SuccessionSuccessor, "readiness" | "isEmergency" | "notes">>,
  ): Promise<SuccessionSuccessor> {
    return this.prisma.withTenant(tenantId, (tx) => tx.successionSuccessor.update({ where: { id }, data }));
  }

  removeSuccessor(tenantId: string, id: string): Promise<SuccessionSuccessor> {
    return this.prisma.withTenant(tenantId, (tx) => tx.successionSuccessor.delete({ where: { id } }));
  }
}
