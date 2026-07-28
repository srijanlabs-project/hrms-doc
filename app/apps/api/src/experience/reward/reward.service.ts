import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { RecognitionRepository } from "../recognition/recognition.repository";
import type { CreateRewardItemDto } from "./dto/create-reward-item.dto";
import { RewardCatalogRepository } from "./reward-catalog.repository";
import { RewardRedemptionRepository } from "./reward-redemption.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-REWARD-001",
    code: "REWARD-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-REWARD-REDEMPTION",
    details: { currentState },
  });
}

/**
 * Wave 4 W4·E15 gap closure ("rewards") — a redemption catalog behind
 * Recognition's existing points counter (see schema.prisma's
 * RewardCatalogItem comment). Balance is always computed live: points
 * received minus points already spent on non-cancelled redemptions.
 */
@Injectable()
export class RewardService {
  constructor(
    private readonly catalogRepository: RewardCatalogRepository,
    private readonly redemptionRepository: RewardRedemptionRepository,
    private readonly recognitionRepository: RecognitionRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async createCatalogItem(dto: CreateRewardItemDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.catalogRepository.create(tenantId, {
      name: dto.name,
      description: dto.description,
      pointsCost: dto.pointsCost,
    });
  }

  async listCatalogActive() {
    const { tenantId } = this.requireAuthenticated();
    return this.catalogRepository.findActive(tenantId);
  }

  async listCatalogAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.catalogRepository.findAll(tenantId);
  }

  async myBalance() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const [received, spent] = await Promise.all([
      this.recognitionRepository.sumPointsReceived(tenantId, employee.id),
      this.redemptionRepository.sumSpentPoints(tenantId, employee.id),
    ]);
    return { pointsReceived: received, pointsSpent: spent, pointsAvailable: received - spent };
  }

  async redeem(rewardItemId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const item = await this.catalogRepository.findById(tenantId, rewardItemId);
    if (!item || !item.active) {
      throw new NotFoundAppError("OBJ-REWARD-ITEM", "Reward item not found.");
    }

    const [received, spent] = await Promise.all([
      this.recognitionRepository.sumPointsReceived(tenantId, employee.id),
      this.redemptionRepository.sumSpentPoints(tenantId, employee.id),
    ]);
    const available = received - spent;
    if (available < item.pointsCost) {
      throw new ValidationAppError([
        { field: "rewardItemId", code: "INSUFFICIENT_POINTS", message: `You need ${item.pointsCost} points but only have ${available}.` },
      ]);
    }

    return this.redemptionRepository.create(tenantId, { employeeId: employee.id, rewardItemId, pointsSpent: item.pointsCost });
  }

  async listMyRedemptions() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.redemptionRepository.findForEmployee(tenantId, employee.id);
  }

  async listAllRedemptionsAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.redemptionRepository.findAllAdmin(tenantId);
  }

  async fulfill(id: string, decisionNote?: string) {
    const { tenantId } = this.requireAuthenticated();
    const redemption = await this.findOrThrow(tenantId, id);
    const result = await this.redemptionRepository.fulfill(tenantId, id, decisionNote);
    if (result.count === 0) {
      throw stateConflict("Only a Requested redemption can be fulfilled.", redemption.status);
    }
    return this.redemptionRepository.findById(tenantId, id);
  }

  async cancel(id: string, decisionNote?: string) {
    const { tenantId } = this.requireAuthenticated();
    const redemption = await this.findOrThrow(tenantId, id);
    const result = await this.redemptionRepository.cancel(tenantId, id, decisionNote);
    if (result.count === 0) {
      throw stateConflict("Only a Requested redemption can be cancelled.", redemption.status);
    }
    return this.redemptionRepository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const redemption = await this.redemptionRepository.findById(tenantId, id);
    if (!redemption) {
      throw new NotFoundAppError("OBJ-REWARD-REDEMPTION", "Reward redemption not found.");
    }
    return redemption;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
