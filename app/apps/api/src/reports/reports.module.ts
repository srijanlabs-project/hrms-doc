import { Module } from "@nestjs/common";
import { AttendanceModule } from "../attendance/attendance.module";
import { LeaveModule } from "../leave/leave.module";
import { OnboardingModule } from "../onboarding/onboarding.module";
import { PayrollModule } from "../payroll/payroll.module";
import { PeopleModule } from "../people/people.module";
import { RecruitmentModule } from "../recruitment/recruitment.module";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

/** Reports v1, Phase 6 — reads across every module built so far. No new schema; pure aggregation. */
@Module({
  imports: [PeopleModule, AttendanceModule, LeaveModule, PayrollModule, RecruitmentModule, OnboardingModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
