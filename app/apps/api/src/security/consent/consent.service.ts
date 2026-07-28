import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ForbiddenAppError } from "../../platform/errors/errors";
import { ConsentRepository } from "./consent.repository";

export const CONSENT_PURPOSES = [
  "BackgroundVerification",
  "DataSharingThirdParty",
  "MarketingCommunications",
  "Photography",
  "Other",
] as const;

/**
 * W0·E29 Security and Governance — consent management v1 slice. Real
 * grant/revoke state per (employee, purpose), self-service plus an admin
 * read view. No consent-request workflow or expiry/renewal cadence — no
 * consumer in this build currently requires re-consent on a schedule.
 */
@Injectable()
export class ConsentService {
  constructor(
    private readonly repository: ConsentRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async setMine(purpose: string, status: "Granted" | "Revoked", notes?: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.upsert(tenantId, employee.id, purpose, status, notes);
  }

  async listForEmployee(employeeId: string) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.findForEmployee(tenantId, employeeId);
  }

  async listAll() {
    const tenantId = this.requireTenantId();
    return this.repository.findAll(tenantId);
  }

  private async assertSelfOrAdmin(employeeId: string): Promise<string> {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isSelf = user?.employeeId === employeeId;
    const isAdmin = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isSelf && !isAdmin) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
