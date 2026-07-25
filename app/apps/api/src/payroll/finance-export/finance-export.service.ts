import { Injectable } from "@nestjs/common";
import { IdentityFinanceRepository } from "../../people/identity-finance/identity-finance.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { PayrollRunRepository } from "../run/payroll-run.repository";

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * v1 slice of docs/08-submodule-specifications/27-integration-platform/05-finance-systems-integration.md.
 * Collapses finance_posting_batch/finance_mapping_rule/
 * finance_reconciliation_result/finance_export_error into one concrete,
 * realistic target instead of a generic multi-system posting abstraction
 * with no real ERP/finance platform to connect to: a bank-compatible bulk
 * NEFT/RTGS disbursement file generated from an Approved/Closed payroll run's
 * already-real net-pay figures and each employee's existing primary
 * BankAccount. No GL/cost-center mapping, no reconciliation loop, no
 * multi-currency handling — this tenant has one ledger and one currency.
 */
@Injectable()
export class FinanceExportService {
  constructor(
    private readonly payrollRunRepository: PayrollRunRepository,
    private readonly identityFinanceRepository: IdentityFinanceRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async generateBankFile(runId: string): Promise<{ filename: string; csv: string; missingBankAccountCount: number }> {
    const { tenantId } = this.requireAuthenticated();
    const run = await this.payrollRunRepository.findById(tenantId, runId);
    if (!run) {
      throw new NotFoundAppError("OBJ-PAYROLL-RUN", "Payroll run not found.");
    }
    if (run.status !== "Approved" && run.status !== "Closed") {
      throw new ValidationAppError([
        { field: "runId", code: "NOT_APPROVED", message: "Only an Approved or Closed run can be exported for disbursement." },
      ]);
    }

    const payableResults = run.results.filter((r) => !r.hasException && r.netPay != null);
    const employeeIds = payableResults.map((r) => r.employeeId);
    const bankAccounts = await this.identityFinanceRepository.findPrimaryForEmployeeIds(tenantId, employeeIds);
    const bankByEmployeeId = new Map(bankAccounts.map((b) => [b.employeeId, b]));

    const rows: string[] = ["Employee Code,Employee Name,Beneficiary Name,Account Number,IFSC Code,Amount,Narration"];
    let missingBankAccountCount = 0;

    for (const result of payableResults) {
      const bank = bankByEmployeeId.get(result.employeeId);
      if (!bank) {
        missingBankAccountCount++;
        continue;
      }
      const narration = `Salary ${run.periodMonth}/${run.periodYear}`;
      rows.push(
        [
          csvEscape(result.employee.employeeCode),
          csvEscape(result.employee.legalName),
          csvEscape(bank.accountHolderName),
          csvEscape(bank.accountNumber),
          csvEscape(bank.ifscCode ?? ""),
          (result.netPay ?? 0).toFixed(2),
          csvEscape(narration),
        ].join(","),
      );
    }

    return {
      filename: `disbursement-${run.periodYear}-${String(run.periodMonth).padStart(2, "0")}.csv`,
      csv: rows.join("\n"),
      missingBankAccountCount,
    };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
