import { Injectable } from "@nestjs/common";
import type { EmergencyResponseContact, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class EmergencyResponseContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.EmergencyResponseContactUncheckedCreateInput, "tenantId">,
  ): Promise<EmergencyResponseContact> {
    return this.prisma.withTenant(tenantId, (tx) => tx.emergencyResponseContact.create({ data: { ...data, tenantId } }));
  }

  findActive(tenantId: string): Promise<EmergencyResponseContact[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.emergencyResponseContact.findMany({ where: { tenantId, isActive: true }, orderBy: { category: "asc" } }),
    );
  }

  findAll(tenantId: string): Promise<EmergencyResponseContact[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.emergencyResponseContact.findMany({ where: { tenantId }, orderBy: { category: "asc" } }),
    );
  }

  setActive(tenantId: string, id: string, isActive: boolean): Promise<EmergencyResponseContact> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.emergencyResponseContact.update({ where: { id }, data: { isActive } }),
    );
  }
}
