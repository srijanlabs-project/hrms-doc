import { PrismaClient } from "@prisma/client";

/**
 * Local dev seed: two tenants, each with one legal entity, so RLS isolation
 * can be demonstrated with real data. Run with `npm run db:seed`.
 */
const prisma = new PrismaClient();

async function main() {
  const acme = await prisma.tenant.upsert({
    where: { code: "acme" },
    update: {},
    create: { code: "acme", name: "Acme Manufacturing Pvt Ltd" },
  });

  const globex = await prisma.tenant.upsert({
    where: { code: "globex" },
    update: {},
    create: { code: "globex", name: "Globex Technology Services" },
  });

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${acme.id}, true)`;
    await tx.legalEntity.upsert({
      where: { tenantId_code: { tenantId: acme.id, code: "ACME-IN" } },
      update: {},
      create: { tenantId: acme.id, code: "ACME-IN", name: "Acme India", country: "IN" },
    });
  });

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${globex.id}, true)`;
    await tx.legalEntity.upsert({
      where: { tenantId_code: { tenantId: globex.id, code: "GLOBEX-US" } },
      update: {},
      create: { tenantId: globex.id, code: "GLOBEX-US", name: "Globex USA", country: "US" },
    });
  });

  console.log("Seeded tenants:", { acme: acme.code, globex: globex.code });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
