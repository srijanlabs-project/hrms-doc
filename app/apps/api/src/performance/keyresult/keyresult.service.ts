import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import { GoalRepository } from "../goal/goal.repository";
import { GoalService } from "../goal/goal.service";
import type { CreateKeyResultDto } from "./dto/create-key-result.dto";
import { KeyResultRepository } from "./keyresult.repository";

/**
 * Wave 3 W3·E11 Performance Management deepening — OKRs and Key Results
 * (docs/03-module-specifications/11-performance-management.md's OKR/KPI
 * catalog item). Reuses Goal directly as the "Objective" (see
 * schema.prisma's KeyResult comment) rather than a parallel entity. Once a
 * Goal has one or more KeyResults, its progress becomes the average
 * completion across them, recomputed on every key-result value update —
 * GoalService.updateProgress() rejects manual updates in that state.
 */
@Injectable()
export class KeyResultService {
  constructor(
    private readonly repository: KeyResultRepository,
    private readonly goalRepository: GoalRepository,
    private readonly goalService: GoalService,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async create(dto: CreateKeyResultDto) {
    const goal = await this.goalService.getOwned(dto.goalId);
    return this.repository.create(goal.tenantId, {
      goalId: dto.goalId,
      title: dto.title,
      targetValue: dto.targetValue,
      unit: dto.unit,
    });
  }

  async updateValue(id: string, currentValue: number) {
    const { tenantId } = await this.currentEmployee.resolve();
    const keyResult = await this.repository.findById(tenantId, id);
    if (!keyResult) {
      throw new NotFoundAppError("OBJ-KEY-RESULT", "Key result not found.");
    }
    await this.goalService.getOwned(keyResult.goalId);

    await this.repository.updateValue(tenantId, id, currentValue);
    await this.recomputeGoalProgress(tenantId, keyResult.goalId);
    return this.repository.findForGoal(tenantId, keyResult.goalId);
  }

  private async recomputeGoalProgress(tenantId: string, goalId: string) {
    const keyResults = await this.repository.findForGoal(tenantId, goalId);
    if (keyResults.length === 0) return;
    const completions = keyResults.map((kr) => Math.min(100, kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : 0));
    const progress = Math.round(completions.reduce((sum, c) => sum + c, 0) / completions.length);
    await this.goalRepository.updateProgress(tenantId, goalId, { progress });
  }
}
