import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Runs `fn` inside a transaction with Postgres Row Level Security scoped to
   * `tenantId` (docs/07-appendices/29-physical-schema-ddl-and-rls-pack.md).
   *
   * `set_config`'s third argument (is_local = true) makes app.tenant_id
   * local to this transaction only — it reverts automatically at commit or
   * rollback, so a pooled/reused connection can never leak tenant context
   * into a later, unrelated request. Every tenant-scoped read or write must
   * go through this method; there is no other sanctioned path to the tables
   * that carry a tenant_isolation policy.
   */
  async withTenant<T>(
    tenantId: string,
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
      return fn(tx);
    });
  }
}
