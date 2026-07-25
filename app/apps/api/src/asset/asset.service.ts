import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../auth/auth.repository";
import { NotificationService } from "../notifications/notification.service";
import { CurrentEmployeeService } from "../people/current-employee.service";
import { RequestContextService } from "../platform/context/request-context.service";
import { NumberSeriesService } from "../platform/number-series/number-series.service";
import { AppError } from "../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../platform/errors/errors";
import { AssetAssignmentRepository } from "./asset-assignment.repository";
import { AssetRepository } from "./asset.repository";
import type { CreateAssetDto } from "./dto/create-asset.dto";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-ASSET-001",
    code: "ASSET-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ASSET",
    details: { currentState },
  });
}

/**
 * v1 slice — see schema.prisma's Asset/AssetAssignment comments for the full
 * list of collapsed spec features. Admin-driven (org_admin/hr_ops assign and
 * process returns directly) — no employee request/approval chain, since the
 * spec frames this as an IT/Workplace-Ops-operated process. The only
 * self-service surface is a read-only "My Assets" list.
 */
@Injectable()
export class AssetService {
  constructor(
    private readonly assets: AssetRepository,
    private readonly assignments: AssetAssignmentRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly numberSeries: NumberSeriesService,
  ) {}

  async createAsset(dto: CreateAssetDto) {
    const { tenantId } = this.requireAuthenticated();
    const assetTag = dto.assetTag ?? (await this.numberSeries.next(tenantId, "Asset"));
    return this.assets.create(tenantId, { assetTag, category: dto.category, name: dto.name });
  }

  async listAssets() {
    const { tenantId } = this.requireAuthenticated();
    return this.assets.findAll(tenantId);
  }

  async listMyAssignments() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.assignments.findForEmployee(tenantId, employee.id);
  }

  async listAllAssignments() {
    const { tenantId } = this.requireAuthenticated();
    return this.assignments.findAll(tenantId);
  }

  async assign(assetId: string, employeeId: string) {
    const { tenantId, userId } = this.requireAuthenticated();

    const asset = await this.assets.findById(tenantId, assetId);
    if (!asset) {
      throw new NotFoundAppError("OBJ-ASSET", "Asset not found.");
    }

    const claimed = await this.assets.markAssigned(tenantId, assetId);
    if (claimed === 0) {
      throw stateConflict(`This asset is currently ${asset.status.toLowerCase()}, not available.`, asset.status);
    }

    const assignment = await this.assignments.create(tenantId, {
      assetId,
      employeeId,
      assignedByUserId: userId,
    });

    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: "asset.assigned",
        title: "Asset assigned to you",
        body: `${asset.category} "${asset.name}" (${asset.assetTag}) has been assigned to you.`,
        linkPath: "/assets",
      });
    }

    return assignment;
  }

  async returnAsset(assignmentId: string, condition: string, notes?: string) {
    const { tenantId } = this.requireAuthenticated();

    const assignment = await this.assignments.findById(tenantId, assignmentId);
    if (!assignment) {
      throw new NotFoundAppError("OBJ-ASSET-ASSIGNMENT", "Assignment not found.");
    }

    const closed = await this.assignments.markReturned(tenantId, assignmentId, { returnCondition: condition, notes });
    if (closed === 0) {
      throw stateConflict("Only an active assignment can be returned.", assignment.status);
    }

    const newAssetStatus = condition === "Good" ? "Available" : "Retired";
    await this.assets.setStatus(tenantId, assignment.assetId, newAssetStatus);

    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, assignment.employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: "asset.returned",
        title: "Asset return processed",
        body: `Your return of ${assignment.asset.category} "${assignment.asset.name}" (${assignment.asset.assetTag}) has been recorded.`,
        linkPath: "/assets",
      });
    }

    return this.assignments.findById(tenantId, assignmentId);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
