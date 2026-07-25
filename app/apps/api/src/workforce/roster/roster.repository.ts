import { Injectable } from "@nestjs/common";
import type { Prisma, RosterEntry, RosterSwapRequest, ShiftDefinition } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type RosterEntryWithShift = RosterEntry & {
  shift: ShiftDefinition;
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeEntry = {
  shift: true,
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.RosterEntryInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class RosterRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsertEntry(
    tenantId: string,
    data: { employeeId: string; shiftId: string; date: Date },
  ): Promise<RosterEntryWithShift> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterEntry.upsert({
        where: { tenantId_employeeId_date: { tenantId, employeeId: data.employeeId, date: data.date } },
        create: { ...data, tenantId },
        update: { shiftId: data.shiftId, status: "Draft" },
        include: includeEntry,
      }),
    );
  }

  findForEmployeeRange(tenantId: string, employeeId: string, from: Date, to: Date): Promise<RosterEntryWithShift[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterEntry.findMany({
        where: { tenantId, employeeId, date: { gte: from, lte: to } },
        include: includeEntry,
        orderBy: { date: "asc" },
      }),
    );
  }

  findForRange(tenantId: string, from: Date, to: Date): Promise<RosterEntryWithShift[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterEntry.findMany({
        where: { tenantId, date: { gte: from, lte: to } },
        include: includeEntry,
        orderBy: [{ date: "asc" }, { employee: { legalName: "asc" } }],
      }),
    );
  }

  async publishRange(tenantId: string, from: Date, to: Date): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterEntry.updateMany({
        where: { tenantId, date: { gte: from, lte: to }, status: "Draft" },
        data: { status: "Published" },
      }),
    );
    return result.count;
  }

  findEntryById(tenantId: string, id: string): Promise<RosterEntryWithShift | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterEntry.findFirst({ where: { id, tenantId }, include: includeEntry }),
    );
  }

  reassignEntry(tenantId: string, id: string, employeeId: string): Promise<void> {
    return this.prisma
      .withTenant(tenantId, (tx) => tx.rosterEntry.update({ where: { id }, data: { employeeId } }))
      .then(() => undefined);
  }

  createSwapRequest(
    tenantId: string,
    data: {
      rosterEntryId: string;
      requestedByEmployeeId: string;
      counterpartEmployeeId: string;
      reason?: string;
    },
  ): Promise<RosterSwapRequest> {
    return this.prisma.withTenant(tenantId, (tx) => tx.rosterSwapRequest.create({ data: { ...data, tenantId } }));
  }

  findSwapById(tenantId: string, id: string): Promise<RosterSwapRequest | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.rosterSwapRequest.findFirst({ where: { id, tenantId } }));
  }

  findSwapsForEmployee(tenantId: string, employeeId: string): Promise<RosterSwapRequest[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterSwapRequest.findMany({
        where: { tenantId, OR: [{ requestedByEmployeeId: employeeId }, { counterpartEmployeeId: employeeId }] },
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  /** Pending swaps requested by any of the given employeeIds (caller resolves "my direct reports" first). */
  findPendingSwapsForRequesters(tenantId: string, requesterEmployeeIds: string[]): Promise<RosterSwapRequest[]> {
    if (requesterEmployeeIds.length === 0) return Promise.resolve([]);
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterSwapRequest.findMany({
        where: { tenantId, status: "Pending", requestedByEmployeeId: { in: requesterEmployeeIds } },
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  async decideSwap(
    tenantId: string,
    id: string,
    data: { status: string; decisionNote?: string; decidedByUserId: string },
  ): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterSwapRequest.updateMany({ where: { id, tenantId }, data: { ...data, decidedAt: new Date() } }),
    );
  }

  async withdrawSwap(tenantId: string, id: string, requestedByEmployeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.rosterSwapRequest.updateMany({
        where: { id, tenantId, requestedByEmployeeId, status: "Pending" },
        data: { status: "Withdrawn" },
      }),
    );
    return result.count;
  }
}
