import { IsIn, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";

const CATEGORIES = ["PF", "ESIC", "TDS", "PT", "Custom"] as const;

export class CreateObligationDto {
  @IsString()
  @Length(1, 20)
  code!: string;

  @IsString()
  @Length(2, 80)
  name!: string;

  @IsIn(CATEGORIES)
  category!: (typeof CATEGORIES)[number];

  @IsInt()
  @Min(1)
  @Max(28)
  dueDayOfMonth!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(30)
  reminderDaysBefore?: number;
}
