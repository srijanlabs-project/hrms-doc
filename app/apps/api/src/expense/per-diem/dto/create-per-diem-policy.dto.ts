import { IsIn, IsPositive } from "class-validator";

const CATEGORIES = ["Domestic", "International", "Other"] as const;

export class CreatePerDiemPolicyDto {
  @IsIn(CATEGORIES) category!: (typeof CATEGORIES)[number];
  @IsPositive() dailyRate!: number;
}

export { CATEGORIES as PER_DIEM_CATEGORIES };
