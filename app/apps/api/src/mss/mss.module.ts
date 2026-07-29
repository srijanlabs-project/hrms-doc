import { Module } from "@nestjs/common";
import { AttendanceModule } from "../attendance/attendance.module";
import { AuthModule } from "../auth/auth.module";
import { ExpenseModule } from "../expense/expense.module";
import { LeaveModule } from "../leave/leave.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { OrgModule } from "../org/org.module";
import { CareerRepository } from "../people/career/career.repository";
import { PeopleModule } from "../people/people.module";
import { AppraisalRepository } from "../performance/appraisal/appraisal.repository";
import { TravelModule } from "../travel/travel.module";
import { DepartmentBudgetController } from "./budget/department-budget.controller";
import { DepartmentBudgetRepository } from "./budget/department-budget.repository";
import { DepartmentBudgetService } from "./budget/department-budget.service";
import { TeamDashboardController } from "./team-dashboard.controller";
import { TeamDashboardService } from "./team-dashboard.service";
import { TransferPromotionController } from "./transfer-promotion/transfer-promotion.controller";
import { TransferPromotionRepository } from "./transfer-promotion/transfer-promotion.repository";
import { TransferPromotionService } from "./transfer-promotion/transfer-promotion.service";

/** Manager Self Service (E05) — unified Team Dashboard + transfers/promotions, 05-manager-self-service.md v1 slice. Department Budget (W5·P gap closure) added as a fourth sub-feature. */
@Module({
  imports: [LeaveModule, ExpenseModule, TravelModule, PeopleModule, AttendanceModule, AuthModule, NotificationsModule, OrgModule],
  controllers: [TeamDashboardController, TransferPromotionController, DepartmentBudgetController],
  providers: [
    TeamDashboardService,
    TransferPromotionService,
    TransferPromotionRepository,
    CareerRepository,
    AppraisalRepository,
    DepartmentBudgetService,
    DepartmentBudgetRepository,
  ],
  exports: [TeamDashboardService],
})
export class MssModule {}
