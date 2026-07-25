import { Injectable } from "@nestjs/common";
import type { OrgPolicy } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateOrgPolicyDto } from "./dto/create-org-policy.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class OrgPolicyRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<OrgPolicy[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.orgPolicy.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<OrgPolicy | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.orgPolicy.findFirst({ where: { id, tenantId, deletedAt: null } }),
    );
  }

  create(tenantId: string, dto: CreateOrgPolicyDto): Promise<OrgPolicy> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.orgPolicy.create({
        data: {
          tenantId,
          category: dto.category,
          title: dto.title,
          content: dto.content,
          effectiveFrom: new Date(dto.effectiveFrom),
        },
      }),
    );
  }

  archive(tenantId: string, id: string): Promise<OrgPolicy> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.orgPolicy.update({ where: { id }, data: { status: "Archived" } }),
    );
  }
}
