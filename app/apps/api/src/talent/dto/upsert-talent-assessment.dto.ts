import { IsIn, IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from "class-validator";

export class UpsertTalentAssessmentDto {
  @IsUUID()
  employeeId!: string;

  @IsInt()
  @Min(2000)
  periodYear!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  performanceRating!: number;

  @IsIn(["Low", "Medium", "High"])
  potentialRating!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
