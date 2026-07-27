import { IsIn, IsOptional, IsString, Length } from "class-validator";

const RISK_LEVELS = ["Low", "Medium", "High"] as const;

export class CompleteSafetyAssessmentDto {
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  findings?: string;

  @IsIn(RISK_LEVELS)
  riskLevel!: (typeof RISK_LEVELS)[number];
}
