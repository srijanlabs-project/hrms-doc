import { PrismaClient } from "@prisma/client";

/**
 * Idempotently provisions a login-capable User, scoped to exactly one e2e
 * spec file's own dedicated email so parallel Jest workers never race on
 * AuthService.requestOtp()'s per-(tenant,user) OTP-challenge invalidation:
 * two spec files logging in as the *same* seeded user in different worker
 * processes at the same time can invalidate each other's outstanding
 * OtpChallenge row mid-flight, intermittently 401ing whichever verify call
 * loses the race. Giving every spec file its own email removes the shared
 * state entirely rather than papering over the race.
 *
 * No employeeId is set — AuthGuard/RolesGuard only read `roles` off the
 * User row itself, so this is a valid login for any endpoint that doesn't
 * route through CurrentEmployeeService (department CRUD, import engine,
 * generic auth-flow checks). Uses a raw PrismaClient with the same
 * set_config('app.tenant_id', ..., true) pattern PrismaService.withTenant()
 * applies internally, since these one-off fixture writes happen outside
 * the app's own request lifecycle.
 */
export async function provisionTestUser(tenantCode: string, email: string, roles: string[]): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const tenant = await prisma.tenant.findUniqueOrThrow({ where: { code: tenantCode } });
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenant.id}, true)`;
      await tx.user.upsert({
        where: { tenantId_email: { tenantId: tenant.id, email } },
        create: { tenantId: tenant.id, email, roles, status: "Active" },
        update: { roles, status: "Active" },
      });
    });
  } finally {
    await prisma.$disconnect();
  }
}
