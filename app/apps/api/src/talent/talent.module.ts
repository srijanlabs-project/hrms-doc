import { Module } from "@nestjs/common";
import { AnalyticsModule } from "../analytics/analytics.module";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { CareerPlanController } from "./career-plan/career-plan.controller";
import { CareerPlanRepository } from "./career-plan/career-plan.repository";
import { CareerPlanService } from "./career-plan/career-plan.service";
import { SuccessionController } from "./succession/succession.controller";
import { SuccessionRepository } from "./succession/succession.repository";
import { SuccessionService } from "./succession/succession.service";
import { TalentAssessmentController } from "./talent-assessment.controller";
import { TalentAssessmentRepository } from "./talent-assessment.repository";
import { TalentAssessmentService } from "./talent-assessment.service";

/** Talent Management, Phase 7 — docs/08-submodule-specifications/13-talent-management/, deepened per Wave 3 E13. */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule, AnalyticsModule],
  controllers: [TalentAssessmentController, SuccessionController, CareerPlanController],
  providers: [
    TalentAssessmentService,
    TalentAssessmentRepository,
    SuccessionService,
    SuccessionRepository,
    CareerPlanService,
    CareerPlanRepository,
  ],
  exports: [SuccessionService],
})
export class TalentModule {}
