import { IsDateString, IsOptional, IsString, Length } from "class-validator";

export class CreateCertificationDto {
  @IsString()
  @Length(1, 160)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  issuingOrganization?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  credentialId?: string;
}
