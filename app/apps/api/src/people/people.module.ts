import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ArrearRepository } from "../payroll/arrear/arrear.repository";
import { ArrearService } from "../payroll/arrear/arrear.service";
import { CompensationRepository } from "../payroll/compensation/compensation.repository";
import { PayrollRunRepository } from "../payroll/run/payroll-run.repository";
import { OrgModule } from "../org/org.module";
import { BackgroundController } from "./background/background.controller";
import { BackgroundRepository } from "./background/background.repository";
import { BackgroundService } from "./background/background.service";
import { CareerController } from "./career/career.controller";
import { CareerRepository } from "./career/career.repository";
import { CareerService } from "./career/career.service";
import { CurrentEmployeeService } from "./current-employee.service";
import { EmployeeController } from "./employee/employee.controller";
import { EmployeeRepository } from "./employee/employee.repository";
import { EmployeeService } from "./employee/employee.service";
import { IdentityFinanceController } from "./identity-finance/identity-finance.controller";
import { IdentityFinanceRepository } from "./identity-finance/identity-finance.repository";
import { IdentityFinanceService } from "./identity-finance/identity-finance.service";
import { PersonalDetailController } from "./personal-detail/personal-detail.controller";
import { PersonalDetailRepository } from "./personal-detail/personal-detail.repository";
import { PersonalDetailService } from "./personal-detail/personal-detail.service";
import { SalaryRevisionController } from "./salary-revision/salary-revision.controller";
import { SalaryRevisionRepository } from "./salary-revision/salary-revision.repository";
import { SalaryRevisionService } from "./salary-revision/salary-revision.service";
import { TimelineController } from "./timeline/timeline.controller";
import { TimelineService } from "./timeline/timeline.service";
import { UserAccessController } from "./user-access/user-access.controller";
import { UserAccessRepository } from "./user-access/user-access.repository";
import { UserAccessService } from "./user-access/user-access.service";

/**
 * People Core service boundary — docs/03-module-specifications/02-people-management.md.
 * Wave 1 deepening pass (task tracker #76): every sub-capability beyond the
 * original employee-master/onboarding/exit proving slices lives here too.
 */
@Module({
  imports: [OrgModule, AuthModule],
  controllers: [
    EmployeeController,
    PersonalDetailController,
    IdentityFinanceController,
    BackgroundController,
    CareerController,
    SalaryRevisionController,
    TimelineController,
    UserAccessController,
  ],
  providers: [
    EmployeeService,
    EmployeeRepository,
    CurrentEmployeeService,
    PersonalDetailService,
    PersonalDetailRepository,
    IdentityFinanceService,
    IdentityFinanceRepository,
    BackgroundService,
    BackgroundRepository,
    CareerService,
    CareerRepository,
    SalaryRevisionService,
    SalaryRevisionRepository,
    CompensationRepository,
    ArrearRepository,
    ArrearService,
    PayrollRunRepository,
    TimelineService,
    UserAccessService,
    UserAccessRepository,
  ],
  exports: [EmployeeRepository, CurrentEmployeeService, EmployeeService, BackgroundRepository],
})
export class PeopleModule {}
