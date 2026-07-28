import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { CommunityController } from "./community/community.controller";
import { CommunityRepository } from "./community/community.repository";
import { CommunityService } from "./community/community.service";
import { EventController } from "./event/event.controller";
import { EventRepository } from "./event/event.repository";
import { EventService } from "./event/event.service";
import { FeedController } from "./feed/feed.controller";
import { FeedRepository } from "./feed/feed.repository";
import { FeedService } from "./feed/feed.service";
import { RecognitionController } from "./recognition/recognition.controller";
import { RecognitionRepository } from "./recognition/recognition.repository";
import { RecognitionService } from "./recognition/recognition.service";
import { RewardController } from "./reward/reward.controller";
import { RewardCatalogRepository } from "./reward/reward-catalog.repository";
import { RewardRedemptionRepository } from "./reward/reward-redemption.repository";
import { RewardService } from "./reward/reward.service";
import { SurveyController } from "./survey/survey.controller";
import { SurveyRepository } from "./survey/survey.repository";
import { SurveyService } from "./survey/survey.service";
import { WellnessController } from "./wellness/wellness.controller";
import { WellnessRepository } from "./wellness/wellness.repository";
import { WellnessService } from "./wellness/wellness.service";

/**
 * Employee Experience, Wave 4 W4·E15 —
 * docs/03-module-specifications/15-employee-experience.md. v1 slice: surveys
 * (incl. pulse, collapsed into a type tag) and peer recognition. Deepened per
 * Wave 3 gap closure with rewards (a redemption catalog behind Recognition's
 * points counter), a text-only social feed, communities, events, and
 * wellness programs. See schema.prisma's model comments for what's deferred.
 */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [
    SurveyController,
    RecognitionController,
    RewardController,
    CommunityController,
    FeedController,
    EventController,
    WellnessController,
  ],
  providers: [
    SurveyService,
    SurveyRepository,
    RecognitionService,
    RecognitionRepository,
    RewardService,
    RewardCatalogRepository,
    RewardRedemptionRepository,
    CommunityService,
    CommunityRepository,
    FeedService,
    FeedRepository,
    EventService,
    EventRepository,
    WellnessService,
    WellnessRepository,
  ],
  exports: [RecognitionService],
})
export class ExperienceModule {}
