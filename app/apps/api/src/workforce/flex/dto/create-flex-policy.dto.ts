import { IsInt, IsString, Length, Matches, Min } from "class-validator";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateFlexPolicyDto {
  @IsString()
  @Length(1, 80)
  name!: string;

  @Matches(TIME_PATTERN, { message: "coreStartTime must be in HH:mm 24-hour format." })
  coreStartTime!: string;

  @Matches(TIME_PATTERN, { message: "coreEndTime must be in HH:mm 24-hour format." })
  coreEndTime!: string;

  @IsInt()
  @Min(1)
  requiredDailyMinutes!: number;
}
