import { Injectable } from "@nestjs/common";
import type { OrgUnit } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateOrgUnitDto } from "./dto/create-org-unit.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class OrgUnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<OrgUnit[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.orgUnit.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "asc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<OrgUnit | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.orgUnit.findFirst({ where: { id, tenantId, deletedAt: null } }));
  }

  create(tenantId: string, dto: CreateOrgUnitDto): Promise<OrgUnit> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.orgUnit.create({
        data: {
          tenantId,
          unitType: dto.unitType,
          code: dto.code,
          name: dto.name,
          parentUnitId: dto.parentUnitId,
          addressLine: dto.addressLine,
          city: dto.city,
          state: dto.state,
          country: dto.country,
        },
      }),
    );
  }
}
