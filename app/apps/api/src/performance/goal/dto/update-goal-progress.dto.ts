import { IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class UpdateGoalProgressDto {
  @IsInt()
  @Min(0)
  @Max(100)
  progress!: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;
}
