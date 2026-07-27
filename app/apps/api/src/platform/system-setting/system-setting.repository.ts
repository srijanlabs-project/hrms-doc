import { Injectable } from "@nestjs/common";
import type { SystemSetting } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SystemSettingRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<SystemSetting[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.systemSetting.findMany({ where: { tenantId }, orderBy: { key: "asc" } }));
  }

  upsert(tenantId: string, key: string, value: string, description: string | undefined): Promise<SystemSetting> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.systemSetting.upsert({
        where: { tenantId_key: { tenantId, key } },
        create: { tenantId, key, value, description },
        update: { value, description },
      }),
    );
  }

  delete(tenantId: string, key: string): Promise<void> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      await tx.systemSetting.delete({ where: { tenantId_key: { tenantId, key } } });
    });
  }
}
