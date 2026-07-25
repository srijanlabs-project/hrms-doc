import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "../../auth/auth.module";
import { NotificationsModule } from "../../notifications/notifications.module";
import { ExpiryReminderService } from "./expiry-reminder.service";
import { SchedulerController } from "./scheduler.controller";

/** Foundation & Platform (E00) — Scheduler engine. */
@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, NotificationsModule],
  controllers: [SchedulerController],
  providers: [ExpiryReminderService],
})
export class SchedulerModule {}
