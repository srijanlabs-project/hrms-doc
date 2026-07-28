import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { AuditService } from "../../platform/audit/audit.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { EmployeeRepository } from "../employee/employee.repository";
import type { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import type { CreateIdentityDocumentDto } from "./dto/create-identity-document.dto";
import type { RevealSensitiveFieldDto } from "./dto/reveal-sensitive-field.dto";
import type { UpsertTaxProfileDto } from "./dto/upsert-tax-profile.dto";
import { IdentityFinanceRepository } from "./identity-finance.repository";

/** Keeps the last 4 characters visible, masks the rest — e.g. "1234567890" -> "••••••7890". */
function maskTail(value: string): string {
  if (value.length <= 4) return "•".repeat(value.length);
  return "•".repeat(value.length - 4) + value.slice(-4);
}

/**
 * v1 slice consolidating 3 catalog domains — national identity + passport/
 * visa/driving license (docs/.../04-national-identity.md), bank accounts
 * (docs/.../06-bank-accounts.md), and tax information (docs/.../07-tax-information.md).
 * Plain fields, no verification/maker-checker workflow. getAll() masks
 * documentNumber/accountNumber server-side by default (W0·E29 data-masking
 * gap closure) — reveal() returns the real value for one specific record and
 * logs the exposure via the Audit Engine, a collapsed slice of the spec's
 * full unmask-approval-workflow (no reason capture, no time-bound reveal —
 * every authorized viewer, self or admin, can reveal on demand).
 */
@Injectable()
export class IdentityFinanceService {
  constructor(
    private readonly repository: IdentityFinanceRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
  ) {}

  async getAll(employeeId: string) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    const [identityDocuments, bankAccounts, taxProfile] = await Promise.all([
      this.repository.findIdentityDocuments(tenantId, employeeId),
      this.repository.findBankAccounts(tenantId, employeeId),
      this.repository.findTaxProfile(tenantId, employeeId),
    ]);
    return {
      identityDocuments: identityDocuments.map((d) => ({ ...d, documentNumber: maskTail(d.documentNumber) })),
      bankAccounts: bankAccounts.map((b) => ({ ...b, accountNumber: maskTail(b.accountNumber) })),
      taxProfile,
    };
  }

  async reveal(employeeId: string, dto: RevealSensitiveFieldDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);

    if (dto.recordType === "IdentityDocument") {
      const documents = await this.repository.findIdentityDocuments(tenantId, employeeId);
      const record = documents.find((d) => d.id === dto.recordId);
      if (!record) throw new NotFoundAppError("OBJ-IDENTITY-DOCUMENT", "Identity document not found.");
      await this.auditService.record({ entityType: "IdentityDocument", entityId: record.id, action: "SensitiveFieldRevealed" });
      return { field: "documentNumber", value: record.documentNumber };
    }

    const accounts = await this.repository.findBankAccounts(tenantId, employeeId);
    const record = accounts.find((b) => b.id === dto.recordId);
    if (!record) throw new NotFoundAppError("OBJ-BANK-ACCOUNT", "Bank account not found.");
    await this.auditService.record({ entityType: "BankAccount", entityId: record.id, action: "SensitiveFieldRevealed" });
    return { field: "accountNumber", value: record.accountNumber };
  }

  async addIdentityDocument(employeeId: string, dto: CreateIdentityDocumentDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.createIdentityDocument(tenantId, employeeId, dto);
  }

  async addBankAccount(employeeId: string, dto: CreateBankAccountDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.createBankAccount(tenantId, employeeId, dto);
  }

  async upsertTaxProfile(employeeId: string, dto: UpsertTaxProfileDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.upsertTaxProfile(tenantId, employeeId, dto);
  }

  private async assertSelfOrAdmin(employeeId: string): Promise<string> {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isSelf = user?.employeeId === employeeId;
    const isAdmin = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isSelf && !isAdmin) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
