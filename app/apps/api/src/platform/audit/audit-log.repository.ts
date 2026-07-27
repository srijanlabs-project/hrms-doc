import { Injectable } from "@nestjs/common";
import type { AuditLog, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface CreateAuditLogInput {
  actorUserId: string;
  entityType: string;
  entityId: string;
  action: string;
  before?: unknown;
  after?: unknown;
}

@Injectable()
export class AuditLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, input: CreateAuditLogInput): Promise<AuditLog> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.auditLog.create({
        data: {
          tenantId,
          actorUserId: input.actorUserId,
          entityType: input.entityType,
          entityId: input.entityId,
          action: input.action,
          before: input.before as Prisma.InputJsonValue,
          after: input.after as Prisma.InputJsonValue,
        },
      }),
    );
  }

  findForEntity(tenantId: string, entityType: string, entityId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.auditLog.findMany({
        where: { tenantId, entityType, entityId },
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { email: true } } },
      }),
    );
  }

  findRecent(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.auditLog.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { actor: { select: { email: true } } },
      }),
    );
  }
}
