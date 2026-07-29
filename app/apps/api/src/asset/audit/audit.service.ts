import { Injectable } from "@nestjs/common";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError } from "../../platform/errors/errors";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AssetAssignmentRepository } from "../asset-assignment.repository";
import { AssetAuditRepository } from "./audit.repository";

function stateConflict(message: string) {
  return new AppError({
    errorRef: "ERR-ASSET-AUDIT-001",
    code: "ASSET-AUDIT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ASSET-AUDIT",
  });
}

/**
 * Wave 4·E18 gap closure ("asset audits") — periodic physical verification,
 * mirroring AccessReviewCycle/Item's exact snapshot-then-decide shape. A
 * cycle snapshots every non-retired asset's status and current holder at
 * creation time (immune to changes mid-cycle); each item then gets a
 * Verified/Missing/Damaged finding. A Damaged finding doesn't auto-create a
 * maintenance record — the auditor opens one separately if warranted.
 */
@Injectable()
export class AssetAuditService {
  constructor(
    private readonly repository: AssetAuditRepository,
    private readonly assignments: AssetAssignmentRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  async startCycle(periodLabel: string) {
    const open = await this.repository.findOpenCycle(this.tenantId);
    if (open) {
      throw stateConflict("An asset audit cycle is already open — close it before starting a new one.");
    }

    const assets = await this.repository.findNonRetiredAssets(this.tenantId);
    const items = await Promise.all(
      assets.map(async (asset) => {
        const activeAssignment = await this.assignments.findActiveForAsset(this.tenantId, asset.id);
        return {
          assetId: asset.id,
          statusSnapshot: asset.status,
          assignedToSnapshot: activeAssignment ? activeAssignment.employee.legalName : null,
        };
      }),
    );

    return this.repository.createCycle(this.tenantId, periodLabel, items);
  }

  listCycles() {
    return this.repository.findAllCycles(this.tenantId);
  }

  async getCycle(id: string) {
    const cycle = await this.repository.findCycleWithItems(this.tenantId, id);
    if (!cycle) {
      throw new NotFoundAppError("OBJ-ASSET-AUDIT", "Asset audit cycle not found.");
    }
    return cycle;
  }

  async decideItem(itemId: string, finding: "Verified" | "Missing" | "Damaged", notes?: string) {
    const item = await this.findPendingItemOrThrow(itemId);
    return this.repository.decideItem(this.tenantId, item.id, finding, this.requestContext.userId!, notes);
  }

  async closeCycle(id: string) {
    const cycle = await this.getCycle(id);
    if (cycle.status === "Closed") {
      throw stateConflict("This cycle is already closed.");
    }
    const pending = await this.repository.countPendingItems(this.tenantId, id);
    if (pending > 0) {
      throw stateConflict(`${pending} item(s) still need a finding before this cycle can close.`);
    }
    return this.repository.closeCycle(this.tenantId, id);
  }

  private async findPendingItemOrThrow(itemId: string) {
    const item = await this.repository.findItemById(this.tenantId, itemId);
    if (!item) {
      throw new NotFoundAppError("OBJ-ASSET-AUDIT", "Asset audit item not found.");
    }
    if (item.finding !== "Pending") {
      throw stateConflict("This item has already been decided.");
    }
    return item;
  }
}
