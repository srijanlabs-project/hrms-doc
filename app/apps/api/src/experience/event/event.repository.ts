import { Injectable } from "@nestjs/common";
import type { EventRsvp, ExperienceEvent, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type ExperienceEventWithRsvpCounts = ExperienceEvent & { _count: { rsvps: number } };

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.ExperienceEventUncheckedCreateInput, "tenantId">): Promise<ExperienceEvent> {
    return this.prisma.withTenant(tenantId, (tx) => tx.experienceEvent.create({ data: { ...data, tenantId } }));
  }

  findPublishedUpcoming(tenantId: string): Promise<ExperienceEventWithRsvpCounts[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.experienceEvent.findMany({
        where: { tenantId, status: "Published" },
        include: { _count: { select: { rsvps: true } } },
        orderBy: { startAt: "asc" },
      }),
    );
  }

  findAllAdmin(tenantId: string): Promise<ExperienceEventWithRsvpCounts[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.experienceEvent.findMany({
        where: { tenantId },
        include: { _count: { select: { rsvps: true } } },
        orderBy: { startAt: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<ExperienceEvent | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.experienceEvent.findFirst({ where: { id, tenantId } }));
  }

  async publish(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.experienceEvent.updateMany({ where: { id, tenantId, status: "Draft" }, data: { status: "Published" } }),
    );
    return result.count;
  }

  findMyRsvp(tenantId: string, eventId: string, employeeId: string): Promise<EventRsvp | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.eventRsvp.findFirst({ where: { tenantId, eventId, employeeId } }));
  }

  upsertRsvp(tenantId: string, eventId: string, employeeId: string, response: string): Promise<EventRsvp> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.eventRsvp.upsert({
        where: { tenantId_eventId_employeeId: { tenantId, eventId, employeeId } },
        create: { tenantId, eventId, employeeId, response },
        update: { response },
      }),
    );
  }
}
