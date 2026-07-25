import { Injectable } from "@nestjs/common";
import type { FinancialCenter } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateFinancialCenterDto } from "./dto/create-financial-center.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class FinancialCenterRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<FinancialCenter[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.financialCenter.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "asc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<FinancialCenter | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.financialCenter.findFirst({ where: { id, tenantId, deletedAt: null } }),
    );
  }

  create(tenantId: string, dto: CreateFinancialCenterDto): Promise<FinancialCenter> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.financialCenter.create({
        data: {
          tenantId,
          centerType: dto.centerType,
          code: dto.code,
          name: dto.name,
          parentCenterId: dto.parentCenterId,
        },
      }),
    );
  }
}
