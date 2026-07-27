import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import { GoLiveChecklistRepository } from "./go-live-checklist.repository";

/** Curated setup tasks, seeded once per tenant on first fetch. Not a full go-live sign-off workflow — no staging environment or second system exists here to hand over between. */
const DEFAULT_ITEMS = [
  { key: "configure_org_structure", label: "Set up organization structure (legal entities, departments)" },
  { key: "import_employees", label: "Import employee master data" },
  { key: "configure_leave_policies", label: "Configure leave policies" },
  { key: "set_up_compensation", label: "Set up employee compensation" },
  { key: "review_payroll_setup", label: "Review payroll configuration" },
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

  async list() {
    const existing = await this.repository.findAll(this.tenantId);
    if (existing.length > 0) {
      return existing;
    }
    await this.repository.createMany(this.tenantId, [...DEFAULT_ITEMS]);
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
