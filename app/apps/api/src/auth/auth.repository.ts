import { Injectable } from "@nestjs/common";
import type { OtpChallenge, Session, Tenant, User } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

export type UserWithEmployeeName = User & { employee: { legalName: string } | null };

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

  /** Includes the linked employee's name for display purposes (e.g. the app shell's user menu). */
  findUserByIdWithEmployeeName(tenantId: string, id: string): Promise<UserWithEmployeeName | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findFirst({
        where: { id, tenantId, deletedAt: null },
        include: { employee: { select: { legalName: true } } },
      }),
    );
  }

  /** Resolves the User account for an Employee (e.g. a manager) so other modules can notify or authorize by employee id. */
  findUserByEmployeeId(tenantId: string, employeeId: string): Promise<User | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findFirst({ where: { tenantId, employeeId, deletedAt: null } }),
    );
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
