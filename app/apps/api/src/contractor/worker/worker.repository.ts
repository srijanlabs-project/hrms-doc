import { Injectable } from "@nestjs/common";
import type { ExternalWorker, ExternalWorkerDocument, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type WorkerWithVendor = ExternalWorker & { vendor: { id: string; name: string } };
export type WorkerWithDocuments = WorkerWithVendor & { documents: ExternalWorkerDocument[] };

const includeVendor = { vendor: { select: { id: true, name: true } } } satisfies Prisma.ExternalWorkerInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class WorkerRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.ExternalWorkerUncheckedCreateInput, "tenantId">,
  ): Promise<WorkerWithVendor> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.externalWorker.create({ data: { ...data, tenantId }, include: includeVendor }),
    );
  }

  findById(tenantId: string, id: string): Promise<WorkerWithDocuments | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.externalWorker.findFirst({
        where: { id, tenantId },
        include: { ...includeVendor, documents: { orderBy: { createdAt: "desc" } } },
      }),
    );
  }

  findAll(tenantId: string, filters: { status?: string; vendorId?: string }): Promise<WorkerWithVendor[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.externalWorker.findMany({
        where: { tenantId, status: filters.status, vendorId: filters.vendorId },
        include: includeVendor,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findExpiredCandidates(tenantId: string): Promise<ExternalWorker[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.externalWorker.findMany({ where: { tenantId, status: "Active", contractEndDate: { lt: new Date() } } }),
    );
  }

  async transition(tenantId: string, id: string, fromStatuses: string[], data: Partial<ExternalWorker>): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.externalWorker.updateMany({ where: { id, tenantId, status: { in: fromStatuses } }, data }),
    );
    return result.count;
  }

  async markExpired(tenantId: string, ids: string[]): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.externalWorker.updateMany({
        where: { id: { in: ids }, tenantId },
        data: { status: "Expired", accessRevokedAt: new Date() },
      }),
    );
  }

  addDocument(
    tenantId: string,
    data: Omit<Prisma.ExternalWorkerDocumentUncheckedCreateInput, "tenantId">,
  ): Promise<ExternalWorkerDocument> {
    return this.prisma.withTenant(tenantId, (tx) => tx.externalWorkerDocument.create({ data: { ...data, tenantId } }));
  }

  async verifyDocument(tenantId: string, id: string, verifiedByUserId: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.externalWorkerDocument.updateMany({
        where: { id, tenantId, isVerified: false },
        data: { isVerified: true, verifiedByUserId, verifiedAt: new Date() },
      }),
    );
    return result.count;
  }

  findDocumentById(tenantId: string, id: string): Promise<ExternalWorkerDocument | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.externalWorkerDocument.findFirst({ where: { id, tenantId } }));
  }
}
