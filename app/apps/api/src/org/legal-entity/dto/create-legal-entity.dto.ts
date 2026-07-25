import { IsOptional, IsString, IsUUID, Length, Matches } from "class-validator";

/** Field rules per docs/07-appendices/18-field-validation-standards-and-rule-matrix.md. */
export class CreateLegalEntityDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]{2,20}$/, {
    message: "code must be 2-20 uppercase alphanumeric characters, - or _",
  })
  code!: string;

  @IsString()
  @Length(2, 120)
  name!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: "country must be a 2-letter ISO code" })
  country?: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}
