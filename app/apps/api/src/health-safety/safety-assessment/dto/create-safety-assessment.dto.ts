import { IsDateString, IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const ASSESSMENT_TYPES = ["Audit", "RiskAssessment", "Drill"] as const;

export class CreateSafetyAssessmentDto {
  @IsIn(ASSESSMENT_TYPES)
  type!: (typeof ASSESSMENT_TYPES)[number];

  @IsString()
  @Length(1, 200)
  location!: string;

  @IsDateString()
  assessedDate!: string;

  @IsOptional()
  @IsUUID()
  conductedByEmployeeId?: string;
}
