import { Injectable } from "@nestjs/common";
import type { SlaPolicy } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class SlaPolicyRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsert(tenantId: string, data: { queue: string; priority: string; resolutionHours: number }): Promise<SlaPolicy> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.slaPolicy.upsert({
        where: { tenantId_queue_priority: { tenantId, queue: data.queue, priority: data.priority } },
        create: { ...data, tenantId },
        update: { resolutionHours: data.resolutionHours },
      }),
    );
  }

  findAll(tenantId: string): Promise<SlaPolicy[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.slaPolicy.findMany({ where: { tenantId }, orderBy: { queue: "asc" } }));
  }

  find(tenantId: string, queue: string, priority: string): Promise<SlaPolicy | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.slaPolicy.findFirst({ where: { tenantId, queue, priority } }),
    );
  }
}
