import { IsDateString, IsInt, IsOptional, IsPositive, IsUUID, Max, Min } from "class-validator";

export class CreateEsopGrantDto {
  @IsUUID()
  employeeId!: string;

  @IsInt()
  @IsPositive()
  totalUnits!: number;

  @IsDateString()
  grantDate!: string;

  @IsDateString()
  vestingStartDate!: string;

  @IsInt()
  @Min(1)
  @Max(10)
  vestingYears!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  cliffMonths?: number;

  @IsOptional()
  @IsPositive()
  exercisePrice?: number;
}
