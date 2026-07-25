import { Injectable } from "@nestjs/common";
import type { Prisma, Vendor } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class VendorRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.VendorUncheckedCreateInput, "tenantId">): Promise<Vendor> {
    return this.prisma.withTenant(tenantId, (tx) => tx.vendor.create({ data: { ...data, tenantId } }));
  }

  findAll(tenantId: string): Promise<Vendor[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.vendor.findMany({ where: { tenantId }, orderBy: { name: "asc" } }));
  }

  findById(tenantId: string, id: string): Promise<Vendor | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.vendor.findFirst({ where: { id, tenantId } }));
  }
}
