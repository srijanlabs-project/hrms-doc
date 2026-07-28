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
import { CheckInController } from "./checkin/checkin.controller";
import { CheckInRepository } from "./checkin/checkin.repository";
import { CheckInService } from "./checkin/checkin.service";
import { CompetencyController } from "./competency/competency.controller";
import { CompetencyRepository } from "./competency/competency.repository";
import { CompetencyService } from "./competency/competency.service";
import { Feedback360Controller } from "./feedback360/feedback360.controller";
import { Feedback360Repository } from "./feedback360/feedback360.repository";
import { Feedback360Service } from "./feedback360/feedback360.service";
import { GoalController } from "./goal/goal.controller";
import { GoalRepository } from "./goal/goal.repository";
import { GoalService } from "./goal/goal.service";
import { KeyResultController } from "./keyresult/keyresult.controller";
import { KeyResultRepository } from "./keyresult/keyresult.repository";
import { KeyResultService } from "./keyresult/keyresult.service";
import { PipController } from "./pip/pip.controller";
import { PipRepository } from "./pip/pip.repository";
import { PipService } from "./pip/pip.service";

/** Performance Management, Phase 7 — docs/03-module-specifications/11-performance-management.md, deepened per Wave 3 E11. */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [
    GoalController,
    KeyResultController,
    AppraisalController,
    Feedback360Controller,
    CalibrationController,
    CompetencyController,
    CheckInController,
    PipController,
  ],
  providers: [
    GoalService,
    GoalRepository,
    KeyResultService,
    KeyResultRepository,
    AppraisalService,
    AppraisalRepository,
    Feedback360Service,
    Feedback360Repository,
    CalibrationService,
    CalibrationRepository,
    CompetencyService,
    CompetencyRepository,
    CheckInService,
    CheckInRepository,
    PipService,
    PipRepository,
  ],
})
export class PerformanceModule {}
