import { IsDateString, IsIn, IsOptional, IsString, Length } from "class-validator";

const CATEGORIES = ["Fitness", "MentalHealth", "Nutrition", "Other"] as const;

export class CreateWellnessProgramDto {
  @IsString() @Length(2, 160) title!: string;
  @IsOptional() @IsString() @Length(0, 1000) description?: string;
  @IsOptional() @IsIn(CATEGORIES) category?: (typeof CATEGORIES)[number];
  @IsDateString() startDate!: string;
  @IsOptional() @IsDateString() endDate?: string;
}

export { CATEGORIES as WELLNESS_CATEGORIES };
