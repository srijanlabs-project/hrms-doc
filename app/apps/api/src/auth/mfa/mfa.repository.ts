import { Injectable } from "@nestjs/common";
import type { MfaFactor } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

@Injectable()
export class MfaRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllForUser(tenantId: string, userId: string): Promise<MfaFactor[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.mfaFactor.findMany({ where: { tenantId, userId }, orderBy: { createdAt: "desc" } }),
    );
  }

  findActiveForUser(tenantId: string, userId: string): Promise<MfaFactor | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.mfaFactor.findFirst({ where: { tenantId, userId, status: "Active" } }));
  }

  findPendingForUser(tenantId: string, userId: string): Promise<MfaFactor | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.mfaFactor.findFirst({ where: { tenantId, userId, status: "PendingEnrollment" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<MfaFactor | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.mfaFactor.findFirst({ where: { id, tenantId } }));
  }

  deletePending(tenantId: string, id: string): Promise<void> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      await tx.mfaFactor.delete({ where: { id } });
    });
  }

  create(tenantId: string, userId: string, secretBase32: string): Promise<MfaFactor> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.mfaFactor.create({ data: { tenantId, userId, secretBase32, status: "PendingEnrollment" } }),
    );
  }

  activate(tenantId: string, id: string): Promise<MfaFactor> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.mfaFactor.update({ where: { id }, data: { status: "Active", verifiedAt: new Date() } }),
    );
  }

  revoke(tenantId: string, id: string): Promise<MfaFactor> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.mfaFactor.update({ where: { id }, data: { status: "Revoked", revokedAt: new Date() } }),
    );
  }
}
