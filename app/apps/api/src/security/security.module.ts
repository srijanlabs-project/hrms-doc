import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ComplianceModule } from "../compliance/compliance.module";
import { AccessReviewController } from "./access-review/access-review.controller";
import { AccessReviewRepository } from "./access-review/access-review.repository";
import { AccessReviewService } from "./access-review/access-review.service";
import { ComplianceOverviewController } from "./compliance-overview/compliance-overview.controller";
import { ComplianceOverviewService } from "./compliance-overview/compliance-overview.service";
import { ConsentModule } from "./consent/consent.module";

/**
 * W0·E29 Security and Governance. AuthModule import gives AccessReviewService
 * the AuthRepository it needs to kill sessions on revoke. ComplianceModule
 * and ConsentModule feed the compliance-overview rollup (see
 * ComplianceOverviewService's doc comment for why it's a rollup, not a new
 * generic monitoring engine). Segregation of duties stays deliberately
 * deferred — this build's role model is 4 coarse roles (org_admin, hr_ops,
 * manager, employee) with no fine-grained permission catalog, so there is no
 * real conflict surface to define rules against; a rule engine here would be
 * decorative, the same reasoning already applied to ABAC.
 */
@Module({
  imports: [AuthModule, ComplianceModule, ConsentModule],
  controllers: [AccessReviewController, ComplianceOverviewController],
  providers: [AccessReviewService, AccessReviewRepository, ComplianceOverviewService],
  exports: [AccessReviewService],
})
export class SecurityModule {}
