import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { OnboardingModule } from "../onboarding/onboarding.module";
import { PeopleModule } from "../people/people.module";
import { ApplicationController } from "./candidate/application.controller";
import { ApplicationRepository } from "./candidate/application.repository";
import { ApplicationService } from "./candidate/application.service";
import { CandidateAssessmentController } from "./candidate/candidate-assessment.controller";
import { CandidateAssessmentRepository } from "./candidate/candidate-assessment.repository";
import { CandidateAssessmentService } from "./candidate/candidate-assessment.service";
import { CandidateController } from "./candidate/candidate.controller";
import { CandidateRepository } from "./candidate/candidate.repository";
import { CandidateService } from "./candidate/candidate.service";
import { ReferralController } from "./candidate/referral.controller";
import { ReferralService } from "./candidate/referral.service";
import { InternalMobilityController } from "./candidate/internal-mobility.controller";
import { InternalMobilityService } from "./candidate/internal-mobility.service";
import { InterviewController } from "./interview/interview.controller";
import { InterviewFeedbackRepository } from "./interview/interview-feedback.repository";
import { InterviewRoundRepository } from "./interview/interview-round.repository";
import { InterviewService } from "./interview/interview.service";
import { BackgroundCheckRepository } from "./offer/background-check.repository";
import { OfferController } from "./offer/offer.controller";
import { OfferRepository } from "./offer/offer.repository";
import { OfferService } from "./offer/offer.service";
import { RequisitionController } from "./requisition/requisition.controller";
import { RequisitionRepository } from "./requisition/requisition.repository";
import { RequisitionService } from "./requisition/requisition.service";

/** Recruitment & ATS, Phase 6 — docs/03-module-specifications/06-recruitment-ats.md, deepened per Wave 3 E06. */
@Module({
  imports: [AuthModule, PeopleModule, OnboardingModule, NotificationsModule],
  controllers: [
    RequisitionController,
    CandidateController,
    CandidateAssessmentController,
    ReferralController,
    InternalMobilityController,
    ApplicationController,
    InterviewController,
    OfferController,
  ],
  providers: [
    RequisitionService,
    RequisitionRepository,
    CandidateService,
    CandidateRepository,
    CandidateAssessmentService,
    CandidateAssessmentRepository,
    ReferralService,
    InternalMobilityService,
    ApplicationService,
    ApplicationRepository,
    InterviewService,
    InterviewRoundRepository,
    InterviewFeedbackRepository,
    OfferService,
    OfferRepository,
    BackgroundCheckRepository,
  ],
  exports: [RequisitionRepository, ApplicationRepository],
})
export class RecruitmentModule {}
