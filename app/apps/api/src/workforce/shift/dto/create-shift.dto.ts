import { IsBoolean, IsInt, IsOptional, IsString, Length, Matches, Min } from "class-validator";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateShiftDto {
  @IsString()
  @Length(1, 20)
  code!: string;

  @IsString()
  @Length(1, 80)
  name!: string;

  @Matches(TIME_PATTERN, { message: "startTime must be in HH:mm 24-hour format." })
  startTime!: string;

  @Matches(TIME_PATTERN, { message: "endTime must be in HH:mm 24-hour format." })
  endTime!: string;

  @IsOptional()
  @IsBoolean()
  crossMidnight?: boolean;

  @IsInt()
  @Min(1)
  plannedMinutes!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  graceMinutes?: number;
}
