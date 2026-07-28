import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FeatureFlagRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.featureFlag.findMany({ where: { tenantId }, orderBy: { key: "asc" } }),
    );
  }

  findByKey(tenantId: string, key: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.featureFlag.findFirst({ where: { tenantId, key } }));
  }

  create(tenantId: string, data: { key: string; name: string; description?: string; enabled: boolean }) {
    return this.prisma.withTenant(tenantId, (tx) => tx.featureFlag.create({ data: { ...data, tenantId } }));
  }

  setEnabled(tenantId: string, key: string, enabled: boolean) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.featureFlag.update({ where: { tenantId_key: { tenantId, key } }, data: { enabled } }),
    );
  }

  delete(tenantId: string, key: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.featureFlag.delete({ where: { tenantId_key: { tenantId, key } } }),
    );
  }
}
