import { IsDateString, IsIn, IsOptional, IsString, Length } from "class-validator";

const DAY_TYPES = ["Working", "Holiday", "Weekend", "Shutdown"] as const;

export class AddCalendarDayDto {
  @IsDateString()
  date!: string;

  @IsIn(DAY_TYPES)
  dayType!: (typeof DAY_TYPES)[number];

  @IsOptional()
  @IsString()
  @Length(0, 120)
  label?: string;
}
