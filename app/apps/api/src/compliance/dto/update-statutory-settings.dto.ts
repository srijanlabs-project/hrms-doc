import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateStatutorySettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumWageThreshold?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lwfEmployeeContribution?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  lwfEmployerContribution?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  lwfFrequencyMonths?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bonusEligibilityCeiling?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bonusPercent?: number;
}
