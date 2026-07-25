import { Injectable } from "@nestjs/common";
import type { OtpChallenge, Session, Tenant, User } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

export type UserWithEmployeeName = User & { employee: { legalName: string; status: string } | null };

/**
 * Data access only. `findTenantByCode` and reads it feeds (findUserByEmail
 * for login) run before a session exists, so they use the plain
 * PrismaService client against the platform-plane `tenants` table (no RLS)
 * or scope explicitly by the tenant just resolved — never from an
 * unauthenticated caller's say-so. Everything else runs through
 * PrismaService.withTenant for RLS scoping, same as every other repository.
 */
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findTenantByCode(code: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { code } });
  }

  findUserByEmail(tenantId: string, email: string): Promise<User | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findFirst({ where: { tenantId, email, deletedAt: null } }),
    );
  }

  findUserById(tenantId: string, id: string): Promise<User | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findFirst({ where: { id, tenantId, deletedAt: null } }),
    );
  }

  /** Used by ComplianceCalendarService to notify all admins of a tenant, not one specific employee. */
  findUsersWithAnyRole(tenantId: string, roles: string[]): Promise<User[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findMany({ where: { tenantId, deletedAt: null, roles: { hasSome: roles } } }),
    );
  }

  /** Includes the linked employee's name + status (app shell user menu, and the exit-portal branch on the frontend). */
  findUserByIdWithEmployeeName(tenantId: string, id: string): Promise<UserWithEmployeeName | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findFirst({
        where: { id, tenantId, deletedAt: null },
        include: { employee: { select: { legalName: true, status: true } } },
      }),
    );
  }

  /** Used by ExitStatusGuard on every non-exempt request; null if the user has no linked employee. */
  async findEmployeeStatusForUser(tenantId: string, userId: string): Promise<string | null> {
    const user = await this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findFirst({
        where: { id: userId, tenantId, deletedAt: null },
        select: { employee: { select: { status: true } } },
      }),
    );
    return user?.employee?.status ?? null;
  }

  /** Resolves the User account for an Employee (e.g. a manager) so other modules can notify or authorize by employee id. */
  findUserByEmployeeId(tenantId: string, employeeId: string): Promise<User | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findFirst({ where: { tenantId, employeeId, deletedAt: null } }),
    );
  }

  createUser(tenantId: string, data: { email: string; roles: string[]; employeeId: string }): Promise<User> {
    return this.prisma.withTenant(tenantId, (tx) => tx.user.create({ data: { ...data, tenantId } }));
  }

  createSession(tenantId: string, userId: string, expiresAt: Date): Promise<Session> {
    return this.prisma.withTenant(tenantId, (tx) => tx.session.create({ data: { tenantId, userId, expiresAt } }));
  }

  findActiveSession(tenantId: string, sessionId: string, userId: string): Promise<Session | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.session.findFirst({ where: { id: sessionId, tenantId, userId } }),
    );
  }

  async revokeSession(tenantId: string, sessionId: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.session.updateMany({ where: { id: sessionId, tenantId }, data: { revokedAt: new Date() } }),
    );
  }

  /** Device management: a session IS the device record for this v1 slice. */
  findActiveSessionsForUser(tenantId: string, userId: string): Promise<Session[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.session.findMany({
        where: { tenantId, userId, revokedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { issuedAt: "desc" },
      }),
    );
  }

  async revokeSessionForUser(tenantId: string, userId: string, sessionId: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.session.updateMany({ where: { id: sessionId, tenantId, userId }, data: { revokedAt: new Date() } }),
    );
  }

  /** Consumes any still-usable challenges for this user so only the newest request-otp call stays valid. */
  async invalidateOutstandingOtpChallenges(tenantId: string, userId: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.otpChallenge.updateMany({
        where: { tenantId, userId, consumedAt: null },
        data: { consumedAt: new Date() },
      }),
    );
  }

  createOtpChallenge(tenantId: string, userId: string, codeHash: string, expiresAt: Date): Promise<OtpChallenge> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.otpChallenge.create({ data: { tenantId, userId, codeHash, expiresAt } }),
    );
  }

  findLatestOtpChallenge(tenantId: string, userId: string): Promise<OtpChallenge | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.otpChallenge.findFirst({
        where: { tenantId, userId, consumedAt: null },
        orderBy: { issuedAt: "desc" },
      }),
    );
  }

  async incrementOtpAttempt(tenantId: string, challengeId: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.otpChallenge.updateMany({
        where: { id: challengeId, tenantId },
        data: { attemptCount: { increment: 1 } },
      }),
    );
  }

  async consumeOtpChallenge(tenantId: string, challengeId: string): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.otpChallenge.updateMany({
        where: { id: challengeId, tenantId },
        data: { consumedAt: new Date() },
      }),
    );
  }
}
