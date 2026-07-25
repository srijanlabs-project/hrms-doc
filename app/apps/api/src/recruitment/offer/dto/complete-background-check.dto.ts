import { IsIn, IsOptional, IsString } from "class-validator";

const RESULT_STATUSES = ["Cleared", "Flagged"] as const;

export class CompleteBackgroundCheckDto {
  @IsIn(RESULT_STATUSES)
  status!: (typeof RESULT_STATUSES)[number];

  @IsOptional()
  @IsString()
  remarks?: string;
}
