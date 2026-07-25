import { Injectable } from "@nestjs/common";
import { DocumentGenerationService } from "../../platform/document-generation/document-generation.service";
import { DocumentTemplateRepository } from "../../platform/document-generation/document-template.repository";
import { IdentityFinanceRepository } from "../../people/identity-finance/identity-finance.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { PayrollRunRepository } from "../run/payroll-run.repository";

const BANK_ADVICE_TEMPLATE_NAME = "Bank Advice Letter";

const BANK_ADVICE_BODY = `Date: {{today}}

To,
{{bankName}},
{{branchName}}

Subject: Salary Payment Advice for {{employeeName}} ({{employeeCode}})

Dear Sir/Madam,

Please arrange to credit the salary for the period {{periodMonth}}/{{periodYear}} to the following account:

Account Holder: {{accountHolderName}}
Account Number: {{accountNumber}}
IFSC Code: {{ifscCode}}
Amount: Rs. {{netPay}}

Employee: {{employeeName}} ({{employeeCode}})
Department: {{department}}
Designation: {{designation}}

Regards,
HR Department`;

/**
 * v1 slice closing Payroll's "bank advice" gap (E09) — a per-employee salary
 * advice letter, distinct from E27's bulk NEFT/RTGS disbursement CSV (the
 * bank-facing transfer instruction file; this is the employee/bank-facing
 * confirmation document). Reuses the Document Generation engine (E00)
 * exactly — no new rendering or storage path, just a system-seeded template
 * and payroll-specific merge fields.
 */
@Injectable()
export class PayrollDocumentService {
  constructor(
    private readonly payrollRunRepository: PayrollRunRepository,
    private readonly identityFinanceRepository: IdentityFinanceRepository,
    private readonly documentTemplates: DocumentTemplateRepository,
    private readonly documentGeneration: DocumentGenerationService,
    private readonly requestContext: RequestContextService,
  ) {}

  async generateBankAdvice(runId: string, employeeId: string) {
    const { tenantId } = this.requireAuthenticated();
    const run = await this.payrollRunRepository.findById(tenantId, runId);
    if (!run) {
      throw new NotFoundAppError("OBJ-PAYROLL-RUN", "Payroll run not found.");
    }
    if (run.status !== "Approved" && run.status !== "Closed") {
      throw new ValidationAppError([
        { field: "runId", code: "NOT_APPROVED", message: "Only an Approved or Closed run can generate a bank advice letter." },
      ]);
    }
    const result = run.results.find((r) => r.employeeId === employeeId);
    if (!result || result.hasException || result.netPay == null) {
      throw new ValidationAppError([
        { field: "employeeId", code: "NO_PAYABLE_RESULT", message: "This employee has no payable result on this run." },
      ]);
    }

    const [bankAccounts] = await Promise.all([this.identityFinanceRepository.findPrimaryForEmployeeIds(tenantId, [employeeId])]);
    const bank = bankAccounts[0];
    if (!bank) {
      throw new ValidationAppError([
        { field: "employeeId", code: "NO_BANK_ACCOUNT", message: "This employee has no primary bank account on file." },
      ]);
    }

    const template = await this.getOrCreateTemplate(tenantId);

    return this.documentGeneration.generate(employeeId, template.id, {
      periodMonth: String(run.periodMonth),
      periodYear: String(run.periodYear),
      netPay: result.netPay.toLocaleString("en-IN"),
      accountHolderName: bank.accountHolderName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode ?? "—",
      bankName: bank.bankName,
      branchName: bank.branchName ?? "—",
    });
  }

  private async getOrCreateTemplate(tenantId: string) {
    const existing = await this.documentTemplates.findByName(tenantId, BANK_ADVICE_TEMPLATE_NAME);
    if (existing) return existing;
    return this.documentTemplates.create(tenantId, {
      name: BANK_ADVICE_TEMPLATE_NAME,
      category: "BankAdvice",
      bodyTemplate: BANK_ADVICE_BODY,
    });
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
