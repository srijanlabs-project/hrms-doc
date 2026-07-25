import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { RecognitionController } from "./recognition/recognition.controller";
import { RecognitionRepository } from "./recognition/recognition.repository";
import { RecognitionService } from "./recognition/recognition.service";
import { SurveyController } from "./survey/survey.controller";
import { SurveyRepository } from "./survey/survey.repository";
import { SurveyService } from "./survey/survey.service";

/**
 * Employee Experience, Wave 4 W4·E15 —
 * docs/03-module-specifications/15-employee-experience.md. v1 slice:
 * surveys (incl. pulse, collapsed into a type tag) and peer recognition.
 * See schema.prisma's Survey/Recognition comments for what's deferred.
 */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [SurveyController, RecognitionController],
  providers: [SurveyService, SurveyRepository, RecognitionService, RecognitionRepository],
})
export class ExperienceModule {}
