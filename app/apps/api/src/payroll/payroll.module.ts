import { Module } from "@nestjs/common";
import { AttendanceModule } from "../attendance/attendance.module";
import { AuthModule } from "../auth/auth.module";
import { LeaveModule } from "../leave/leave.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { DocumentGenerationModule } from "../platform/document-generation/document-generation.module";
import { IdentityFinanceRepository } from "../people/identity-finance/identity-finance.repository";
import { PeopleModule } from "../people/people.module";
import { ArrearController } from "./arrear/arrear.controller";
import { ArrearRepository } from "./arrear/arrear.repository";
import { ArrearService } from "./arrear/arrear.service";
import { CompensationController } from "./compensation/compensation.controller";
import { CompensationRepository } from "./compensation/compensation.repository";
import { CompensationService } from "./compensation/compensation.service";
import { PayrollDocumentService } from "./document/payroll-document.service";
import { FinanceExportService } from "./finance-export/finance-export.service";
import { FnfController } from "./fnf/fnf.controller";
import { FnfRepository } from "./fnf/fnf.repository";
import { FnfService } from "./fnf/fnf.service";
import { IncentiveBonusController } from "./incentive-bonus/incentive-bonus.controller";
import { IncentiveBonusRepository } from "./incentive-bonus/incentive-bonus.repository";
import { IncentiveBonusService } from "./incentive-bonus/incentive-bonus.service";
import { LoanAdvanceController } from "./loan-advance/loan-advance.controller";
import { LoanAdvanceRepository } from "./loan-advance/loan-advance.repository";
import { LoanAdvanceService } from "./loan-advance/loan-advance.service";
import { PayComponentController } from "./pay-component/pay-component.controller";
import { PayComponentRepository } from "./pay-component/pay-component.repository";
import { PayComponentService } from "./pay-component/pay-component.service";
import { PayslipController } from "./payslip/payslip.controller";
import { PayslipService } from "./payslip/payslip.service";
import { PayrollRunController } from "./run/payroll-run.controller";
import { PayrollRunRepository } from "./run/payroll-run.repository";
import { PayrollRunService } from "./run/payroll-run.service";
import { WebhookModule } from "../webhook/webhook.module";

/**
 * Payroll module, Phase 5's final workflow vertical — docs/03-module-specifications/09-payroll.md.
 * Wave 2 W2·E09 deepening (task tracker #82) added pay components, arrears,
 * and full-and-final settlement; a later gap-closure pass added loans and
 * advances (recurring installment deduction, wired into PayrollRunService),
 * incentives/bonus/variable pay (one type-tagged table, reusing ArrearEntry
 * for payout — zero payroll-engine changes), and a per-employee bank advice
 * letter (reusing the Document Generation engine from Foundation & Platform).
 */
@Module({
  imports: [AuthModule, PeopleModule, AttendanceModule, NotificationsModule, LeaveModule, WebhookModule, DocumentGenerationModule],
  controllers: [
    CompensationController,
    PayrollRunController,
    PayslipController,
    PayComponentController,
    ArrearController,
    FnfController,
    LoanAdvanceController,
    IncentiveBonusController,
  ],
  providers: [
    CompensationService,
    CompensationRepository,
    PayrollRunService,
    PayrollRunRepository,
    PayslipService,
    PayComponentService,
    PayComponentRepository,
    ArrearService,
    ArrearRepository,
    FnfService,
    FnfRepository,
    FinanceExportService,
    IdentityFinanceRepository,
    LoanAdvanceService,
    LoanAdvanceRepository,
    IncentiveBonusService,
    IncentiveBonusRepository,
    PayrollDocumentService,
  ],
  exports: [PayrollRunRepository, PayslipService, CompensationRepository],
})
export class PayrollModule {}
