import { Injectable } from "@nestjs/common";
import type { LeaveEncashmentRequest, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type EncashmentRequestWithEmployee = LeaveEncashmentRequest & { employee: { id: string; legalName: string } };

const includeEmployee = { employee: { select: { id: true, legalName: true } } } satisfies Prisma.LeaveEncashmentRequestInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class LeaveEncashmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.LeaveEncashmentRequestUncheckedCreateInput, "tenantId">,
  ): Promise<EncashmentRequestWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveEncashmentRequest.create({ data: { ...data, tenantId }, include: includeEmployee }),
    );
  }

  findById(tenantId: string, id: string): Promise<EncashmentRequestWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveEncashmentRequest.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<EncashmentRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveEncashmentRequest.findMany({ where: { tenantId, employeeId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findAll(tenantId: string, status?: string): Promise<EncashmentRequestWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveEncashmentRequest.findMany({ where: { tenantId, status }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  async decide(
    tenantId: string,
    id: string,
    data: { status: string; decisionNote?: string; decidedByUserId: string },
  ): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.leaveEncashmentRequest.updateMany({ where: { id, tenantId, status: "Pending" }, data: { ...data, decidedAt: new Date() } }),
    );
    return result.count;
  }
}
