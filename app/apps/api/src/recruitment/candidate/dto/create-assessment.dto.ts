import { IsIn, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";

const ASSESSMENT_TYPES = ["Technical", "Aptitude", "Behavioral", "Other"] as const;

export class CreateAssessmentDto {
  @IsOptional()
  @IsString()
  applicationId?: string;

  @IsIn(ASSESSMENT_TYPES)
  type!: (typeof ASSESSMENT_TYPES)[number];

  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  maxScore?: number;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
