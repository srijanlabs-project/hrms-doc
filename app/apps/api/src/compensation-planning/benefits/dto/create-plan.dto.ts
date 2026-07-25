import { IsIn, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

const CATEGORIES = ["Insurance", "Retirement", "Wellness", "FlexAllowance"] as const;

export class CreateBenefitPlanDto {
  @IsString()
  @Length(2, 40)
  code!: string;

  @IsString()
  @Length(2, 160)
  name!: string;

  @IsIn(CATEGORIES)
  category!: (typeof CATEGORIES)[number];

  @IsOptional()
  @IsNumber()
  @Min(0)
  employerCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  employeeCost?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAnnualAllocation?: number;
}
