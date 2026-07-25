import { IsIn, IsOptional, IsString, Length } from "class-validator";

const DOCUMENT_TYPES = ["OfferLetter", "Payslip", "Certificate", "IdProof", "Contract", "Other"] as const;

export class CreateEmployeeDocumentDto {
  @IsIn(DOCUMENT_TYPES)
  documentType!: (typeof DOCUMENT_TYPES)[number];

  @IsString()
  @Length(1, 160)
  title!: string;

  @IsOptional()
  @IsString()
  referenceUrl?: string;

  @IsOptional()
  @IsString()
  fileId?: string;
}
