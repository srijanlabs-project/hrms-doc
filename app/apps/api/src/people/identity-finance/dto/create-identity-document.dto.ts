import { IsDateString, IsIn, IsOptional, IsString, Length } from "class-validator";

const DOCUMENT_TYPES = ["PAN", "Aadhaar", "Passport", "DrivingLicense", "VoterID", "NationalID", "Visa", "Other"] as const;

export class CreateIdentityDocumentDto {
  @IsIn(DOCUMENT_TYPES)
  documentType!: (typeof DOCUMENT_TYPES)[number];

  @IsString()
  @Length(1, 60)
  documentNumber!: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  issuingCountry?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  fileId?: string;
}
