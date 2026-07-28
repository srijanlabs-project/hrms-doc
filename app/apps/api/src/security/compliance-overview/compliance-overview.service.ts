import { Injectable } from "@nestjs/common";
import { ComplianceCalendarService } from "../../compliance/compliance.service";
import { AccessReviewService } from "../access-review/access-review.service";
import { ConsentService } from "../consent/consent.service";

/**
 * W0·E29 Security and Governance — compliance monitoring v1 slice. A
 * read-only rollup over three already-real signals (statutory compliance
 * tasks, the open access-review cycle, and consent revocations) rather than
 * a new generic monitoring/alerting engine — no consumer needs cross-domain
 * alert rules yet, just a single glance at where things stand.
 */
@Injectable()
export class ComplianceOverviewService {
  constructor(
    private readonly complianceCalendar: ComplianceCalendarService,
    private readonly accessReview: AccessReviewService,
    private readonly consent: ConsentService,
  ) {}

  async getOverview() {
    const [openTasks, overdueTasks, accessReviewCycle, consentRecords] = await Promise.all([
      this.complianceCalendar.listTasks("Open"),
      this.complianceCalendar.listTasks("Overdue"),
      this.accessReview.getOpenCycleSummary(),
      this.consent.listAll(),
    ]);

    return {
      complianceTasks: { open: openTasks.length, overdue: overdueTasks.length },
      accessReview: accessReviewCycle,
      consent: {
        total: consentRecords.length,
        revoked: consentRecords.filter((r) => r.status === "Revoked").length,
      },
    };
  }
}
