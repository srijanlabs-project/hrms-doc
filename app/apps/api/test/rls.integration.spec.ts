import { PrismaClient } from "@prisma/client";

/**
 * Integration test (real local Postgres, not mocked) proving RLS actually
 * isolates tenants through the `staffsy` app role — the single most
 * load-bearing guarantee in this codebase, since every domain module trusts
 * PrismaService.withTenant()/set_config('app.tenant_id', ...) rather than
 * filtering by tenantId in application code. Converts and extends
 * scripts/rls-check.ts (a standalone script run manually via `npm run
 * db:rls-check`) into the real Jest suite; that script stays as a quick
 * manual sanity check, this is what runs in `npm test`.
 *
 * Requires the two seeded tenants (`npm run db:seed`, once against a fresh
 * DB) to already exist — read-only against them, no cleanup needed.
 */
describe("Row Level Security tenant isolation", () => {
  const prisma = new PrismaClient();
  let srijanLabsId: string;
  let globexId: string;

  beforeAll(async () => {
    const srijanLabs = await prisma.tenant.findUniqueOrThrow({ where: { code: "srijanlabs" } });
    const globex = await prisma.tenant.findUniqueOrThrow({ where: { code: "globex" } });
    srijanLabsId = srijanLabs.id;
    globexId = globex.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("scopes legal_entities to the tenant set via app.tenant_id", async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${srijanLabsId}, true)`;
      const rows = await tx.legalEntity.findMany();
      expect(rows.length).toBeGreaterThan(0);
      expect(rows.every((r) => r.tenantId === srijanLabsId)).toBe(true);
      expect(rows.some((r) => r.code === "SRIJAN-IN")).toBe(true);
      expect(rows.every((r) => r.code !== "GLOBEX-US")).toBe(true);
    });
  });

  it("returns a disjoint result set for a different tenant", async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${globexId}, true)`;
      const rows = await tx.legalEntity.findMany();
      expect(rows.every((r) => r.tenantId === globexId)).toBe(true);
      expect(rows.some((r) => r.code === "GLOBEX-US")).toBe(true);
    });
  });

  it("fails closed (returns zero rows, not everything) when no tenant context is set", async () => {
    await prisma.$transaction(async (tx) => {
      const rows = await tx.legalEntity.findMany();
      expect(rows).toHaveLength(0);
    });
  });

  it("rejects a cross-tenant write via the WITH CHECK policy", async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${srijanLabsId}, true)`;
      await expect(
        tx.legalEntity.create({
          data: { tenantId: globexId, code: "SPOOFED-RLS-TEST", name: "Should never be created" },
        }),
      ).rejects.toThrow();
    });
  });

  it("scopes employees to the tenant, by table with a different shape/relations", async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${srijanLabsId}, true)`;
      const rows = await tx.employee.findMany();
      expect(rows.every((r) => r.tenantId === srijanLabsId)).toBe(true);
      expect(rows.some((r) => r.employeeCode === "SRIJAN-0001")).toBe(true);
      expect(rows.every((r) => r.employeeCode !== "GLX-0001")).toBe(true);
    });
  });

  it("scopes users (the login-credential table) to the tenant", async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${srijanLabsId}, true)`;
      const rows = await tx.user.findMany();
      expect(rows.every((r) => r.tenantId === srijanLabsId)).toBe(true);
      expect(rows.some((r) => r.email === "priya.sharma@srijanlabs.example")).toBe(true);
      expect(rows.every((r) => r.email !== "alex.carter@globex.example")).toBe(true);
    });
  });

  it("scopes leave_policies to the tenant", async () => {
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${globexId}, true)`;
      const rows = await tx.leavePolicy.findMany();
      expect(rows.every((r) => r.tenantId === globexId)).toBe(true);
    });

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${srijanLabsId}, true)`;
      const rows = await tx.leavePolicy.findMany();
      expect(rows.every((r) => r.tenantId === srijanLabsId)).toBe(true);
    });
  });
});
