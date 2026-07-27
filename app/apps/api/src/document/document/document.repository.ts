import { Injectable } from "@nestjs/common";
import type { Document, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type DocumentWithVersions = Document & {
  employee: { id: string; legalName: string; employeeCode: string } | null;
  versions: {
    id: string;
    versionNumber: number;
    fileId: string;
    uploadedByUserId: string;
    notes: string | null;
    createdAt: Date;
  }[];
};

const includeVersions = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
  versions: {
    orderBy: { versionNumber: "desc" as const },
    select: { id: true, versionNumber: true, fileId: true, uploadedByUserId: true, notes: true, createdAt: true },
  },
} satisfies Prisma.DocumentInclude;

export interface CreateDocumentInput {
  title: string;
  category: string;
  employeeId?: string;
  retentionPolicyId?: string;
  createdByUserId: string;
  fileId: string;
  uploadedByUserId: string;
  notes?: string;
}

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: CreateDocumentInput): Promise<DocumentWithVersions> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.document.create({
        data: {
          tenantId,
          title: data.title,
          category: data.category,
          employeeId: data.employeeId,
          retentionPolicyId: data.retentionPolicyId,
          createdByUserId: data.createdByUserId,
          versions: {
            create: { tenantId, versionNumber: 1, fileId: data.fileId, uploadedByUserId: data.uploadedByUserId, notes: data.notes },
          },
        },
        include: includeVersions,
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<DocumentWithVersions | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.document.findFirst({ where: { id, tenantId }, include: includeVersions }));
  }

  findAll(tenantId: string, status?: string): Promise<DocumentWithVersions[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.document.findMany({ where: { tenantId, status }, include: includeVersions, orderBy: { createdAt: "desc" } }),
    );
  }

  /** Employee scope: own documents plus organization-wide (employeeId null) documents, published only. */
  findForEmployee(tenantId: string, employeeId: string): Promise<DocumentWithVersions[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.document.findMany({
        where: { tenantId, status: "Published", OR: [{ employeeId }, { employeeId: null }] },
        include: includeVersions,
        orderBy: { publishedAt: "desc" },
      }),
    );
  }

  async addVersion(
    tenantId: string,
    documentId: string,
    data: { fileId: string; uploadedByUserId: string; notes?: string },
  ): Promise<DocumentWithVersions> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const latest = await tx.documentVersion.findFirst({ where: { tenantId, documentId }, orderBy: { versionNumber: "desc" } });
      await tx.documentVersion.create({
        data: {
          tenantId,
          documentId,
          versionNumber: (latest?.versionNumber ?? 0) + 1,
          fileId: data.fileId,
          uploadedByUserId: data.uploadedByUserId,
          notes: data.notes,
        },
      });
      return tx.document.update({ where: { id: documentId }, data: {}, include: includeVersions });
    });
  }

  async transition(tenantId: string, id: string, fromStatuses: string[], data: Partial<Document>): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.document.updateMany({ where: { id, tenantId, status: { in: fromStatuses } }, data }),
    );
    return result.count;
  }

  findExpiryCandidates(tenantId: string): Promise<(Document & { retentionPolicy: { retentionMonths: number } | null })[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.document.findMany({
        where: { tenantId, status: { in: ["Published", "Archived"] }, retentionPolicyId: { not: null } },
        include: { retentionPolicy: { select: { retentionMonths: true } } },
      }),
    );
  }

  async markExpired(tenantId: string, ids: string[]): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.document.updateMany({ where: { id: { in: ids }, tenantId }, data: { status: "Expired", expiredAt: new Date() } }),
    );
  }
}
