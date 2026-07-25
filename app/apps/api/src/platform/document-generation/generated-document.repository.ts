import { Injectable } from "@nestjs/common";
import type { GeneratedDocument } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface CreateGeneratedDocumentInput {
  templateId: string;
  employeeId: string;
  fileId: string;
  generatedByUserId: string;
}

@Injectable()
export class GeneratedDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, input: CreateGeneratedDocumentInput): Promise<GeneratedDocument> {
    return this.prisma.withTenant(tenantId, (tx) => tx.generatedDocument.create({ data: { tenantId, ...input } }));
  }

  findForEmployee(tenantId: string, employeeId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.generatedDocument.findMany({
        where: { tenantId, employeeId },
        orderBy: { createdAt: "desc" },
        include: {
          template: { select: { name: true, category: true } },
          file: { select: { id: true, originalName: true, mimeType: true } },
        },
      }),
    );
  }
}
