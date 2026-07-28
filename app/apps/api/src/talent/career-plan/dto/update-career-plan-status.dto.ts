import { IsIn } from "class-validator";

const STATUSES = ["Active", "Achieved", "Cancelled"] as const;

export class UpdateCareerPlanStatusDto {
  @IsIn(STATUSES)
  status!: (typeof STATUSES)[number];
}

export { STATUSES };
