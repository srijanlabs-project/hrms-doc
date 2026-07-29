import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { AssetRepository } from "../asset.repository";
import type { CreateMaintenanceRecordDto } from "./dto/create-maintenance-record.dto";
import { MaintenanceRepository } from "./maintenance.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-ASSET-MAINTENANCE-001",
    code: "ASSET-MAINTENANCE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ASSET-MAINTENANCE",
    details: { currentState },
  });
}

/**
 * Wave 4·E18 gap closure ("asset maintenance"). Admin-driven, no vendor
 * master, no cost/parts tracking. Opening a record forces the asset into
 * UnderRepair; completing or cancelling reverts it to Available regardless
 * of whether it's currently assigned to someone — maintenance doesn't touch
 * the assignment record.
 */
@Injectable()
export class MaintenanceService {
  constructor(
    private readonly repository: MaintenanceRepository,
    private readonly assets: AssetRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateMaintenanceRecordDto) {
    const { tenantId, userId } = this.requireAuthenticated();

    const asset = await this.assets.findById(tenantId, dto.assetId);
    if (!asset) {
      throw new NotFoundAppError("OBJ-ASSET", "Asset not found.");
    }
    if (asset.status === "Retired") {
      throw stateConflict("A retired asset cannot be sent for maintenance.", asset.status);
    }
    if (asset.status === "UnderRepair") {
      throw stateConflict("This asset already has maintenance in progress.", asset.status);
    }

    const record = await this.repository.create(tenantId, {
      assetId: dto.assetId,
      maintenanceType: dto.maintenanceType,
      description: dto.description,
      scheduledDate: new Date(dto.scheduledDate),
      createdByUserId: userId,
    });

    await this.assets.setStatus(tenantId, dto.assetId, "UnderRepair");

    return record;
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async listForAsset(assetId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForAsset(tenantId, assetId);
  }

  async complete(id: string, notes?: string) {
    const { tenantId } = this.requireAuthenticated();
    const record = await this.findOrThrow(tenantId, id);

    const count = await this.repository.updateStatus(tenantId, id, {
      status: "Completed",
      completedDate: new Date(),
      notes,
    });
    if (count === 0) {
      throw stateConflict("Only a scheduled maintenance record can be completed.", record.status);
    }

    await this.assets.setStatus(tenantId, record.assetId, "Available");
    return this.repository.findById(tenantId, id);
  }

  async cancel(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const record = await this.findOrThrow(tenantId, id);

    const count = await this.repository.updateStatus(tenantId, id, { status: "Cancelled" });
    if (count === 0) {
      throw stateConflict("Only a scheduled maintenance record can be cancelled.", record.status);
    }

    await this.assets.setStatus(tenantId, record.assetId, "Available");
    return this.repository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const record = await this.repository.findById(tenantId, id);
    if (!record) {
      throw new NotFoundAppError("OBJ-ASSET-MAINTENANCE", "Maintenance record not found.");
    }
    return record;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
