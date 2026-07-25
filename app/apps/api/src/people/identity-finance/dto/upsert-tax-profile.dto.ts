import { IsOptional, IsString, Length } from "class-validator";

export class UpsertTaxProfileDto {
  @IsOptional()
  @IsString()
  @Length(0, 20)
  panNumber?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  taxRegime?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  taxResidencyCountry?: string;
}
