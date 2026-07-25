import { Injectable } from "@nestjs/common";
import type { Company } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateCompanyDto } from "./dto/create-company.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<Company[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.company.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "asc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<Company | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.company.findFirst({ where: { id, tenantId, deletedAt: null } }));
  }

  create(tenantId: string, dto: CreateCompanyDto): Promise<Company> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.company.create({
        data: {
          tenantId,
          code: dto.code,
          name: dto.name,
          parentCompanyId: dto.parentCompanyId,
          logoUrl: dto.logoUrl,
          primaryColor: dto.primaryColor,
          tagline: dto.tagline,
          fiscalYearStartMonth: dto.fiscalYearStartMonth,
        },
      }),
    );
  }
}
