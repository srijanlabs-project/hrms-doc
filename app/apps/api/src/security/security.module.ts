import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AccessReviewController } from "./access-review/access-review.controller";
import { AccessReviewRepository } from "./access-review/access-review.repository";
import { AccessReviewService } from "./access-review/access-review.service";

/** W0·E29 Security and Governance. AuthModule import gives AccessReviewService the AuthRepository it needs to kill sessions on revoke. */
@Module({
  imports: [AuthModule],
  controllers: [AccessReviewController],
  providers: [AccessReviewService, AccessReviewRepository],
})
export class SecurityModule {}
