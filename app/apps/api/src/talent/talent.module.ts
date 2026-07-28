import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { SuccessionController } from "./succession/succession.controller";
import { SuccessionRepository } from "./succession/succession.repository";
import { SuccessionService } from "./succession/succession.service";
import { TalentAssessmentController } from "./talent-assessment.controller";
import { TalentAssessmentRepository } from "./talent-assessment.repository";
import { TalentAssessmentService } from "./talent-assessment.service";

/** Talent Management, Phase 7 — docs/08-submodule-specifications/13-talent-management/, deepened per Wave 3 E13. */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [TalentAssessmentController, SuccessionController],
  providers: [
    TalentAssessmentService,
    TalentAssessmentRepository,
    SuccessionService,
    SuccessionRepository,
  ],
  exports: [SuccessionService],
})
export class TalentModule {}
