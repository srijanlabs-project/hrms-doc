import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { CertificationController } from "./certification/certification.controller";
import { CertificationRepository } from "./certification/certification.repository";
import { CertificationService } from "./certification/certification.service";
import { CourseController } from "./course/course.controller";
import { CourseRepository } from "./course/course.repository";
import { CourseService } from "./course/course.service";
import { EnrollmentController } from "./enrollment/enrollment.controller";
import { EnrollmentRepository } from "./enrollment/enrollment.repository";
import { EnrollmentService } from "./enrollment/enrollment.service";

/** Learning & Development, Phase 7 — docs/08-submodule-specifications/12-learning-and-development/, deepened per Wave 3 E12. */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [CourseController, EnrollmentController, CertificationController],
  providers: [
    CourseService,
    CourseRepository,
    EnrollmentService,
    EnrollmentRepository,
    CertificationService,
    CertificationRepository,
  ],
})
export class LearningModule {}
