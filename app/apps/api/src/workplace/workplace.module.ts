import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { BookingController } from "./booking/booking.controller";
import { BookingRepository } from "./booking/booking.repository";
import { BookingService } from "./booking/booking.service";
import { ResourceController } from "./resource/resource.controller";
import { ResourceRepository } from "./resource/resource.repository";
import { ResourceService } from "./resource/resource.service";
import { VisitorController } from "./visitor/visitor.controller";
import { VisitorRepository } from "./visitor/visitor.repository";
import { VisitorService } from "./visitor/visitor.service";

/**
 * Wave 4 W4·E21 Visitor and Workplace Management, built from scratch —
 * docs/03-module-specifications/21-visitor-workplace-management.md. See
 * schema.prisma's Visitor/WorkplaceResource/WorkplaceBooking comments for
 * the collapsed entity decisions. AI demand forecasting, access-control/
 * meeting-platform/transport-system integrations, and badge/QR hardware all
 * stay deliberately deferred — no real consumer or external system in this
 * environment to justify them.
 */
@Module({
  imports: [AuthModule, NotificationsModule, PeopleModule],
  controllers: [VisitorController, ResourceController, BookingController],
  providers: [VisitorRepository, VisitorService, ResourceRepository, ResourceService, BookingRepository, BookingService],
})
export class WorkplaceModule {}
