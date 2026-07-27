import { IsIn, IsOptional, IsString, Length } from "class-validator";

const CATEGORIES = ["Fire", "Medical", "Security", "Facilities", "Other"] as const;

export class CreateEmergencyResponseContactDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @Length(1, 120)
  role!: string;

  @IsString()
  @Length(1, 30)
  phone!: string;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];
}
