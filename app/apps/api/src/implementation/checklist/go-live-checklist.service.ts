import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import { GoLiveChecklistRepository } from "./go-live-checklist.repository";

/**
 * Curated setup tasks, seeded once per tenant on first fetch. Not a full
 * go-live sign-off workflow — no staging environment or second system
 * exists here to hand over between.
 *
 * W5·P gap closure ("cutover"): the Cutover-phase items below are the
 * go/no-go governance sequence for flipping a tenant to live — kept on this
 * same flat checklist via the `phase` tag rather than a parallel
 * CutoverPlan model, still governance tracking rather than a real
 * environment-switch mechanism.
 */
const DEFAULT_ITEMS = [
  { key: "configure_org_structure", label: "Set up organization structure (legal entities, departments)", phase: "Setup" },
  { key: "import_employees", label: "Import employee master data", phase: "Setup" },
  { key: "configure_leave_policies", label: "Configure leave policies", phase: "Setup" },
  { key: "set_up_compensation", label: "Set up employee compensation", phase: "Setup" },
  { key: "review_payroll_setup", label: "Review payroll configuration", phase: "Setup" },
  { key: "cutover_data_freeze", label: "Freeze non-critical data changes ahead of go-live", phase: "Cutover" },
  { key: "cutover_final_reconciliation", label: "Run final data import and reconciliation", phase: "Cutover" },
  { key: "cutover_go_no_go", label: "Complete go/no-go readiness review", phase: "Cutover" },
  { key: "cutover_live_confirmed", label: "Confirm production go-live", phase: "Cutover" },
] as const;

@Injectable()
export class GoLiveChecklistService {
  constructor(
    private readonly repository: GoLiveChecklistRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  /** Backfills any DEFAULT_ITEMS keys missing for this tenant — not just an empty-list seed — so a tenant already past the original 5 Setup items still gets the new Cutover items on next fetch. */
  async list() {
    const existing = await this.repository.findAll(this.tenantId);
    const existingKeys = new Set(existing.map((item) => item.key));
    const missing = DEFAULT_ITEMS.filter((item) => !existingKeys.has(item.key));
    if (missing.length === 0) {
      return existing;
    }
    await this.repository.createMany(this.tenantId, [...missing]);
    return this.repository.findAll(this.tenantId);
  }

  async setCompleted(key: string, completed: boolean) {
    const existing = await this.repository.findByKey(this.tenantId, key);
    if (!existing) {
      throw new NotFoundAppError("OBJ-GO-LIVE-CHECKLIST-ITEM", "Checklist item not found.");
    }
    return this.repository.setCompleted(this.tenantId, key, completed, this.requestContext.userId);
  }
}
