import { Injectable } from "@nestjs/common";
import { AuditService } from "../../platform/audit/audit.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import type { AssignableRole } from "./dto/provision-login.dto";
import { UserAccessRepository, type EmployeeAccessRow } from "./user-access.repository";

const DEFAULT_ROLES: AssignableRole[] = ["employee"];

/** Why one employee couldn't be given a login — surfaced per row so a 50-person bulk run explains its skips instead of just reporting a count. */
export type ProvisionSkipReason = "AlreadyHasLogin" | "NoPersonalEmail" | "EmailAlreadyUsed" | "NotActive";

export interface ProvisionResult {
  employeeId: string;
  employeeCode: string;
  legalName: string;
  created: boolean;
  email?: string;
  skipReason?: ProvisionSkipReason;
}

/**
 * W1·E03 gap closure: creating the login for an existing employee. Until now
 * a User row was only ever minted in two places — company provisioning (the
 * first org_admin) and OfferService's offer→employee conversion — so anyone
 * added via Bulk Import or created directly in the directory had an employee
 * record but no way to sign in. Setting up a 50-person company therefore had
 * no non-manual path to logins at all.
 *
 * There is no password to set: auth is workspace-code + email + OTP, so a
 * "login" is exactly one User row (email, roles, employeeId link). Email is
 * taken from Employee.personalEmail, which User.email must match for the
 * OTP lookup to resolve.
 *
 * provisionMissing() is deliberately idempotent and never throws on a single
 * bad row — it reports per-employee outcomes so a bulk run over an imported
 * roster is safe to re-run after fixing the rows it skipped.
 */
@Injectable()
export class UserAccessService {
  constructor(
    private readonly repository: UserAccessRepository,
    private readonly requestContext: RequestContextService,
    private readonly audit: AuditService,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  list(): Promise<EmployeeAccessRow[]> {
    return this.repository.findEmployeeAccess(this.tenantId);
  }

  /** Single-employee provisioning — the correction path (fix a typo'd email, then retry one person rather than the whole roster). */
  async provisionOne(employeeId: string, roles?: AssignableRole[]): Promise<ProvisionResult> {
    const rows = await this.repository.findEmployeeAccess(this.tenantId);
    const row = rows.find((r) => r.employeeId === employeeId);
    if (!row) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    return this.provisionRow(row, roles ?? DEFAULT_ROLES);
  }

  /** Bulk path: every employee that has no login yet. Idempotent — employees who already have one are reported as skipped, not re-created or errored. */
  async provisionMissing(roles?: AssignableRole[]): Promise<{ created: number; skipped: number; results: ProvisionResult[] }> {
    const rows = await this.repository.findEmployeeAccess(this.tenantId);
    const results: ProvisionResult[] = [];
    for (const row of rows) {
      if (row.user) continue; // Already has a login — not a skip worth reporting on a bulk run over the whole roster.
      results.push(await this.provisionRow(row, roles ?? DEFAULT_ROLES));
    }
    const created = results.filter((r) => r.created).length;
    return { created, skipped: results.length - created, results };
  }

  async updateRoles(userId: string, roles: AssignableRole[]) {
    const count = await this.repository.updateRoles(this.tenantId, userId, roles);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-USER", "User not found.");
    }
    await this.audit.record({ entityType: "User", entityId: userId, action: "RolesUpdated", after: { roles } });
    return { id: userId, roles };
  }

  private async provisionRow(row: EmployeeAccessRow, roles: AssignableRole[]): Promise<ProvisionResult> {
    const base = { employeeId: row.employeeId, employeeCode: row.employeeCode, legalName: row.legalName };

    if (row.user) return { ...base, created: false, skipReason: "AlreadyHasLogin" };
    // A separated employee would be blocked by ExitStatusGuard on their first request anyway — don't mint an account that can't be used.
    if (row.status === "Separated") return { ...base, created: false, skipReason: "NotActive" };
    if (!row.personalEmail) return { ...base, created: false, skipReason: "NoPersonalEmail" };

    const email = row.personalEmail.trim().toLowerCase();
    const existing = await this.repository.findUserByEmail(this.tenantId, email);
    // Same address already signs in as someone else in this company (e.g. a shared inbox, or a rehire whose old account was never relinked).
    if (existing) return { ...base, created: false, skipReason: "EmailAlreadyUsed" };

    try {
      const user = await this.repository.createUser(this.tenantId, { email, roles, employeeId: row.employeeId });
      await this.audit.record({
        entityType: "User",
        entityId: user.id,
        action: "LoginProvisioned",
        after: { email, roles, employeeId: row.employeeId },
      });
      return { ...base, created: true, email };
    } catch (err) {
      // Lost a race against a concurrent provision for the same email — report it like the pre-check would have, don't fail the whole batch.
      if (this.repository.isUniqueViolation(err)) {
        return { ...base, created: false, skipReason: "EmailAlreadyUsed" };
      }
      throw err;
    }
  }
}
