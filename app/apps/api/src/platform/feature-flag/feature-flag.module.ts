import { Module } from "@nestjs/common";
import { FeatureFlagController } from "./feature-flag.controller";
import { FeatureFlagRepository } from "./feature-flag.repository";
import { FeatureFlagService } from "./feature-flag.service";

@Module({
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService, FeatureFlagRepository],
  exports: [FeatureFlagService],
})
export class FeatureFlagModule {}
