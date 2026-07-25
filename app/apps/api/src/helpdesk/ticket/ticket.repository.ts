import { Injectable } from "@nestjs/common";
import type { Prisma, Ticket, TicketComment } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type TicketWithEmployee = Ticket & {
  employee: { id: string; legalName: string };
  assignedAgent: { id: string; legalName: string } | null;
};

const includeEmployees = {
  employee: { select: { id: true, legalName: true } },
  assignedAgent: { select: { id: true, legalName: true } },
} satisfies Prisma.TicketInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.TicketUncheckedCreateInput, "tenantId">,
  ): Promise<TicketWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.create({ data: { ...data, tenantId }, include: includeEmployees }),
    );
  }

  findById(tenantId: string, id: string): Promise<TicketWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.findFirst({ where: { id, tenantId }, include: includeEmployees }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<TicketWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.findMany({ where: { tenantId, employeeId }, include: includeEmployees, orderBy: { createdAt: "desc" } }),
    );
  }

  findAll(tenantId: string, filters: { queue?: string; status?: string }): Promise<TicketWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.findMany({
        where: { tenantId, queue: filters.queue, status: filters.status },
        include: includeEmployees,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findOverdueUnescalated(tenantId: string): Promise<Ticket[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.findMany({
        where: {
          tenantId,
          isEscalated: false,
          dueAt: { lt: new Date() },
          status: { notIn: ["Resolved", "Closed"] },
        },
      }),
    );
  }

  async markEscalated(tenantId: string, ids: string[]): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.updateMany({ where: { id: { in: ids }, tenantId }, data: { isEscalated: true } }),
    );
  }

  async assign(tenantId: string, id: string, agentEmployeeId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.updateMany({
        where: { id, tenantId, status: "Open" },
        data: { assignedAgentId: agentEmployeeId, status: "Assigned" },
      }),
    );
    return result.count;
  }

  async startProgress(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.updateMany({ where: { id, tenantId, status: "Assigned" }, data: { status: "InProgress" } }),
    );
    return result.count;
  }

  async resolve(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.updateMany({
        where: { id, tenantId, status: { in: ["Assigned", "InProgress"] } },
        data: { status: "Resolved", resolvedAt: new Date() },
      }),
    );
    return result.count;
  }

  async close(tenantId: string, id: string, satisfactionRating?: number): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.updateMany({
        where: { id, tenantId, status: "Resolved" },
        data: { status: "Closed", closedAt: new Date(), satisfactionRating },
      }),
    );
    return result.count;
  }

  async reopen(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.ticket.updateMany({
        where: { id, tenantId, status: "Closed" },
        data: { status: "Open", resolvedAt: null, closedAt: null, satisfactionRating: null },
      }),
    );
    return result.count;
  }

  async setDueAt(tenantId: string, id: string, dueAt: Date): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) => tx.ticket.updateMany({ where: { id, tenantId }, data: { dueAt } }));
  }

  addComment(
    tenantId: string,
    data: Omit<Prisma.TicketCommentUncheckedCreateInput, "tenantId">,
  ): Promise<TicketComment> {
    return this.prisma.withTenant(tenantId, (tx) => tx.ticketComment.create({ data: { ...data, tenantId } }));
  }

  findCommentsForTicket(tenantId: string, ticketId: string): Promise<TicketComment[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.ticketComment.findMany({ where: { tenantId, ticketId }, orderBy: { createdAt: "asc" } }),
    );
  }
}
