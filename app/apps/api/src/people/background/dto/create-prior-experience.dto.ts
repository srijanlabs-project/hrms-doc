import { IsDateString, IsOptional, IsString, Length } from "class-validator";

export class CreatePriorExperienceDto {
  @IsString()
  @Length(1, 160)
  companyName!: string;

  @IsString()
  @Length(1, 120)
  title!: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  reasonForLeaving?: string;
}
