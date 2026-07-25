import { Module } from "@nestjs/common";
import { AuthModule } from "../auth.module";
import { DelegationController } from "./delegation.controller";
import { DelegationRepository } from "./delegation.repository";
import { DelegationService } from "./delegation.service";

/** Identity and Access deepening (06-delegation.md). */
@Module({
  imports: [AuthModule],
  controllers: [DelegationController],
  providers: [DelegationService, DelegationRepository],
  exports: [DelegationService],
})
export class DelegationModule {}
