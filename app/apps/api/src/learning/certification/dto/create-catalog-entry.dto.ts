import { IsBoolean, IsInt, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateCertificationCatalogDto {
  @IsString()
  @Length(2, 40)
  code!: string;

  @IsString()
  @Length(2, 160)
  name!: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  validityMonths?: number;

  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;
}
