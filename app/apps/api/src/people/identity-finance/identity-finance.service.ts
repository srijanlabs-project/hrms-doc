import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { EmployeeRepository } from "../employee/employee.repository";
import type { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import type { CreateIdentityDocumentDto } from "./dto/create-identity-document.dto";
import type { UpsertTaxProfileDto } from "./dto/upsert-tax-profile.dto";
import { IdentityFinanceRepository } from "./identity-finance.repository";

/**
 * v1 slice consolidating 3 catalog domains — national identity + passport/
 * visa/driving license (docs/.../04-national-identity.md), bank accounts
 * (docs/.../06-bank-accounts.md), and tax information (docs/.../07-tax-information.md).
 * Plain fields, no verification/maker-checker workflow — see schema.prisma's
 * comments and this phase's disclosed security-depth gap (no encryption/
 * masking, same as every other PII field in this app).
 */
@Injectable()
export class IdentityFinanceService {
  constructor(
    private readonly repository: IdentityFinanceRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async getAll(employeeId: string) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    const [identityDocuments, bankAccounts, taxProfile] = await Promise.all([
      this.repository.findIdentityDocuments(tenantId, employeeId),
      this.repository.findBankAccounts(tenantId, employeeId),
      this.repository.findTaxProfile(tenantId, employeeId),
    ]);
    return { identityDocuments, bankAccounts, taxProfile };
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
