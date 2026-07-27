import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../platform/prisma/prisma.service";

@Injectable()
export class GoLiveChecklistRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.goLiveChecklistItem.findMany({ where: { tenantId }, orderBy: { createdAt: "asc" } }),
    );
  }

  createMany(tenantId: string, items: { key: string; label: string }[]) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.goLiveChecklistItem.createMany({ data: items.map((item) => ({ tenantId, ...item })) }),
    );
  }

  findByKey(tenantId: string, key: string) {
    return this.prisma.withTenant(tenantId, (tx) => tx.goLiveChecklistItem.findFirst({ where: { tenantId, key } }));
  }

  setCompleted(tenantId: string, key: string, completed: boolean, completedByUserId: string | undefined) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.goLiveChecklistItem.update({
        where: { tenantId_key: { tenantId, key } },
        data: {
          completed,
          completedByUserId: completed ? completedByUserId : null,
          completedAt: completed ? new Date() : null,
        },
      }),
    );
  }
}
