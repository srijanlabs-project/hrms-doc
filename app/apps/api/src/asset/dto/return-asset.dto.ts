import { IsIn, IsOptional, IsString, Length } from "class-validator";

const RETURN_CONDITIONS = ["Good", "Damaged", "Lost"] as const;

export class ReturnAssetDto {
  @IsIn(RETURN_CONDITIONS)
  condition!: (typeof RETURN_CONDITIONS)[number];

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
