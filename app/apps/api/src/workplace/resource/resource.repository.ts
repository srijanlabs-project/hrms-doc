import { Injectable } from "@nestjs/common";
import type { Prisma, WorkplaceResource } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ResourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.WorkplaceResourceUncheckedCreateInput, "tenantId">): Promise<WorkplaceResource> {
    return this.prisma.withTenant(tenantId, (tx) => tx.workplaceResource.create({ data: { ...data, tenantId } }));
  }

  findById(tenantId: string, id: string): Promise<WorkplaceResource | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.workplaceResource.findFirst({ where: { id, tenantId } }));
  }

  listActive(tenantId: string): Promise<WorkplaceResource[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workplaceResource.findMany({ where: { tenantId, isActive: true }, orderBy: { name: "asc" } }),
    );
  }

  listAll(tenantId: string): Promise<WorkplaceResource[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.workplaceResource.findMany({ where: { tenantId }, orderBy: { name: "asc" } }));
  }

  async setActive(tenantId: string, id: string, isActive: boolean): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.workplaceResource.updateMany({ where: { id, tenantId }, data: { isActive } }),
    );
    return result.count;
  }
}
