import { IsInt, IsString, Length, Min } from "class-validator";

export class CreateCalibrationSessionDto {
  @IsInt()
  @Min(2000)
  periodYear!: number;

  @IsString()
  @Length(2, 80)
  cohortLabel!: string;
}
