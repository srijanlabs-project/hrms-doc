import { PrismaClient } from "@prisma/client";

/**
 * Phase 1 done-criterion: proves Postgres RLS actually isolates tenants
 * through the `staffsy` app role (not a superuser, so FORCE ROW LEVEL
 * SECURITY is genuinely being exercised). Run with `npm run db:rls-check`
 * after `db:migrate` and `db:seed`. Exits non-zero on any failed assertion.
 */
const prisma = new PrismaClient();

let failures = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS  ${message}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${message}`);
  }
}

async function main() {
  const acme = await prisma.tenant.findUniqueOrThrow({ where: { code: "acme" } });
  const globex = await prisma.tenant.findUniqueOrThrow({ where: { code: "globex" } });

  console.log("1. Tenant A (acme) sees only its own rows");
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${acme.id}, true)`;
    const rows = await tx.legalEntity.findMany();
    assert(rows.length === 1, `expected 1 row, got ${rows.length}`);
    assert(rows.every((r) => r.tenantId === acme.id), "all rows belong to acme");
    assert(rows.every((r) => r.code !== "GLOBEX-US"), "no globex row leaked into acme's result set");
  });

  console.log("2. Tenant B (globex) sees only its own rows");
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${globex.id}, true)`;
    const rows = await tx.legalEntity.findMany();
    assert(rows.length === 1, `expected 1 row, got ${rows.length}`);
    assert(rows.every((r) => r.tenantId === globex.id), "all rows belong to globex");
  });

  console.log("3. No tenant context set -> zero rows (fail closed, not open)");
  await prisma.$transaction(async (tx) => {
    const rows = await tx.legalEntity.findMany();
    assert(rows.length === 0, `expected 0 rows with no app.tenant_id set, got ${rows.length}`);
  });

  console.log("4. Cross-tenant write is rejected by the WITH CHECK policy");
  // The failed insert aborts the Postgres transaction; nothing else runs on
  // `tx` after the catch. Postgres treats a COMMIT of an aborted transaction
  // as an implicit ROLLBACK rather than raising a client-visible error, so
  // no explicit rollback call is needed here.
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${acme.id}, true)`;
    let rejected = false;
    try {
      await tx.legalEntity.create({
        data: { tenantId: globex.id, code: "SPOOFED", name: "Should never be created" },
      });
    } catch {
      rejected = true;
    }
    assert(rejected, "insert of a globex-owned row while scoped to acme was rejected");
  });

  if (failures > 0) {
    console.error(`\n${failures} assertion(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log("\nAll RLS isolation assertions passed.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
