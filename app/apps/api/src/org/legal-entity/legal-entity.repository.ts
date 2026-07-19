import { Injectable } from "@nestjs/common";
import type { LegalEntity } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateLegalEntityDto } from "./dto/create-legal-entity.dto";

/**
 * Data access only — no business rules here. Every method runs inside
 * PrismaService.withTenant so Postgres RLS scopes the query; tenantId is
 * still passed explicitly (rather than read from context internally) so a
 * repository call can never silently run tenant-unscoped.
 */
@Injectable()
export class LegalEntityRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<LegalEntity[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.legalEntity.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  create(tenantId: string, dto: CreateLegalEntityDto): Promise<LegalEntity> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.legalEntity.create({
        data: {
          tenantId,
          code: dto.code,
          name: dto.name,
          country: dto.country ?? "IN",
        },
      }),
    );
  }
}
