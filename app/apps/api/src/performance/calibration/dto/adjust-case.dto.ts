import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class AdjustCalibrationCaseDto {
  @IsInt()
  @Min(1)
  @Max(5)
  calibratedRating!: number;

  @IsOptional()
  @IsString()
  rationale?: string;
}
