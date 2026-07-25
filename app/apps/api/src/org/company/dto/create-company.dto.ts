import { IsInt, IsOptional, IsString, IsUUID, Length, Matches, Max, Min } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]{2,20}$/, {
    message: "code must be 2-20 uppercase alphanumeric characters, - or _",
  })
  code!: string;

  @IsString()
  @Length(2, 120)
  name!: string;

  @IsOptional()
  @IsUUID()
  parentCompanyId?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  primaryColor?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  tagline?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  fiscalYearStartMonth?: number;
}
