import { IsDateString, IsIn, IsOptional } from "class-validator";

const EXIT_REASONS = ["Resignation", "Termination", "Retirement", "Other"] as const;

export class SeparateEmployeeDto {
  @IsDateString()
  lastWorkingDay!: string;

  @IsOptional()
  @IsIn(EXIT_REASONS)
  reason?: (typeof EXIT_REASONS)[number];
}
