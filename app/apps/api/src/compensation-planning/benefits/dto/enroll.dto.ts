import { IsDateString, IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export class EnrollBenefitDto {
  @IsUUID()
  benefitPlanId!: string;

  @IsDateString()
  effectiveDate!: string;

  /** Required for FlexAllowance plans — the employee's chosen annual allocation. */
  @IsOptional()
  @IsNumber()
  @Min(0)
  allocatedAmount?: number;
}
