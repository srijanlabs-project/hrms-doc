import { IsDateString, IsOptional, IsPositive, IsString, Length } from "class-validator";

export class CreateSalaryRevisionDto {
  @IsPositive()
  proposedMonthlyBasic!: number;

  @IsDateString()
  effectiveDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  reason?: string;
}
