import { Injectable } from "@nestjs/common";
import type { Prisma, Visitor } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type VisitorWithHost = Visitor & { hostEmployee: { id: string; legalName: string; employeeCode: string } };

const includeHost = {
  hostEmployee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.VisitorInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class VisitorRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.VisitorUncheckedCreateInput, "tenantId">): Promise<VisitorWithHost> {
    return this.prisma.withTenant(tenantId, (tx) => tx.visitor.create({ data: { ...data, tenantId }, include: includeHost }));
  }

  findById(tenantId: string, id: string): Promise<VisitorWithHost | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.visitor.findFirst({ where: { id, tenantId }, include: includeHost }));
  }

  findForHost(tenantId: string, hostEmployeeId: string): Promise<VisitorWithHost[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.visitor.findMany({ where: { tenantId, hostEmployeeId }, include: includeHost, orderBy: { scheduledAt: "desc" } }),
    );
  }

  findAll(tenantId: string, status?: string): Promise<VisitorWithHost[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.visitor.findMany({ where: { tenantId, status }, include: includeHost, orderBy: { scheduledAt: "desc" } }),
    );
  }

  findExpiredCandidates(tenantId: string): Promise<Visitor[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.visitor.findMany({
        where: { tenantId, status: { in: ["Requested", "Approved"] }, scheduledAt: { lt: new Date() } },
      }),
    );
  }

  async markExpired(tenantId: string, ids: string[]): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.visitor.updateMany({ where: { id: { in: ids }, tenantId }, data: { status: "Expired" } }),
    );
  }

  async transition(tenantId: string, id: string, fromStatuses: string[], data: Partial<Visitor>): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.visitor.updateMany({ where: { id, tenantId, status: { in: fromStatuses } }, data }),
    );
    return result.count;
  }
}
