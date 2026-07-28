import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { CompensationRepository } from "../payroll/compensation/compensation.repository";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { ComplianceController } from "./compliance.controller";
import { ComplianceRepository } from "./compliance.repository";
import { ComplianceCalendarService } from "./compliance.service";
import { StatutoryComplianceController } from "./statutory-compliance.controller";
import { StatutoryComplianceRepository } from "./statutory-compliance.repository";
import { StatutoryComplianceService } from "./statutory-compliance.service";

/**
 * Wave 2 W2·E10 Statutory and Compliance deepening — docs/08-submodule-specifications/10-statutory-and-compliance/05-compliance-calendar.md.
 * Gratuity, statutory bonus, minimum wages, and labour welfare fund are now
 * real computed checks (StatutoryComplianceService) riding existing
 * employee/compensation data — gratuity itself lives in FnfService since it
 * is per-employee-on-exit, not a tenant-wide periodic figure. Shops and
 * establishment / factory compliance stay deferred: they are physical-
 * premises license/renewal tracking with no computable formula, already
 * coverable via the generic Custom-category ComplianceObligation catalog
 * below. Country-specific compliance (04-country-specific-compliance.md)
 * stays deferred — this tenant operates in a single country/jurisdiction,
 * so a multi-country rule-pack abstraction has no second jurisdiction to
 * prove it against.
 */
@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [ComplianceController, StatutoryComplianceController],
  providers: [
    ComplianceCalendarService,
    ComplianceRepository,
    StatutoryComplianceService,
    StatutoryComplianceRepository,
    EmployeeRepository,
    CompensationRepository,
  ],
  exports: [ComplianceCalendarService],
})
export class ComplianceModule {}
