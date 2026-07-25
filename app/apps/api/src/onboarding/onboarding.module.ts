import { Module } from "@nestjs/common";
import { PeopleModule } from "../people/people.module";
import { OnboardingAdminController } from "./onboarding-admin.controller";
import { OnboardingCaseRepository } from "./onboarding-case.repository";
import { OnboardingController } from "./onboarding.controller";
import { OnboardingService } from "./onboarding.service";

/**
 * Onboarding, Phase 6 — docs/08-submodule-specifications/02-people-management/09-onboarding.md.
 * OnboardingCaseRepository is exported so RecruitmentModule's OfferService
 * can create a case directly when an offer converts, without a circular
 * module dependency (onboarding never needs to know about offers).
 */
@Module({
  imports: [PeopleModule],
  controllers: [OnboardingController, OnboardingAdminController],
  providers: [OnboardingService, OnboardingCaseRepository],
  exports: [OnboardingCaseRepository],
})
export class OnboardingModule {}
