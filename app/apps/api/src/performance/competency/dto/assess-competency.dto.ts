import { IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from "class-validator";

export class AssessCompetencyDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  competencyId!: string;

  @IsInt()
  @Min(2000)
  periodYear!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  comments?: string;
}
