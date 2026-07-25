import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { AppraisalController } from "./appraisal/appraisal.controller";
import { AppraisalRepository } from "./appraisal/appraisal.repository";
import { AppraisalService } from "./appraisal/appraisal.service";
import { CalibrationController } from "./calibration/calibration.controller";
import { CalibrationRepository } from "./calibration/calibration.repository";
import { CalibrationService } from "./calibration/calibration.service";
import { Feedback360Controller } from "./feedback360/feedback360.controller";
import { Feedback360Repository } from "./feedback360/feedback360.repository";
import { Feedback360Service } from "./feedback360/feedback360.service";
import { GoalController } from "./goal/goal.controller";
import { GoalRepository } from "./goal/goal.repository";
import { GoalService } from "./goal/goal.service";

/** Performance Management, Phase 7 — docs/03-module-specifications/11-performance-management.md, deepened per Wave 3 E11. */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [GoalController, AppraisalController, Feedback360Controller, CalibrationController],
  providers: [
    GoalService,
    GoalRepository,
    AppraisalService,
    AppraisalRepository,
    Feedback360Service,
    Feedback360Repository,
    CalibrationService,
    CalibrationRepository,
  ],
})
export class PerformanceModule {}
