import { Injectable } from "@nestjs/common";
import type { DocumentTemplate } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import type { CreateTemplateDto } from "./dto/create-template.dto";

@Injectable()
export class DocumentTemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<DocumentTemplate[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.documentTemplate.findMany({ where: { tenantId }, orderBy: { createdAt: "asc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<DocumentTemplate | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.documentTemplate.findFirst({ where: { id, tenantId } }));
  }

  findByName(tenantId: string, name: string): Promise<DocumentTemplate | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.documentTemplate.findFirst({ where: { tenantId, name } }));
  }

  create(tenantId: string, dto: CreateTemplateDto): Promise<DocumentTemplate> {
    return this.prisma.withTenant(tenantId, (tx) => tx.documentTemplate.create({ data: { tenantId, ...dto } }));
  }
}
