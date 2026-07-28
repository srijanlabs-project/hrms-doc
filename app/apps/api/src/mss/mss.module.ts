import { Module } from "@nestjs/common";
import { AttendanceModule } from "../attendance/attendance.module";
import { AuthModule } from "../auth/auth.module";
import { ExpenseModule } from "../expense/expense.module";
import { LeaveModule } from "../leave/leave.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { CareerRepository } from "../people/career/career.repository";
import { PeopleModule } from "../people/people.module";
import { TravelModule } from "../travel/travel.module";
import { TeamDashboardController } from "./team-dashboard.controller";
import { TeamDashboardService } from "./team-dashboard.service";
import { TransferPromotionController } from "./transfer-promotion/transfer-promotion.controller";
import { TransferPromotionRepository } from "./transfer-promotion/transfer-promotion.repository";
import { TransferPromotionService } from "./transfer-promotion/transfer-promotion.service";

/** Manager Self Service (E05) — unified Team Dashboard + transfers/promotions, 05-manager-self-service.md v1 slice. */
@Module({
  imports: [LeaveModule, ExpenseModule, TravelModule, PeopleModule, AttendanceModule, AuthModule, NotificationsModule],
  controllers: [TeamDashboardController, TransferPromotionController],
  providers: [TeamDashboardService, TransferPromotionService, TransferPromotionRepository, CareerRepository],
  exports: [TeamDashboardService],
})
export class MssModule {}
