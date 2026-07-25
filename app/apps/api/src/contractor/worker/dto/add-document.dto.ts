import { IsIn, IsUUID } from "class-validator";

const DOCUMENT_TYPES = ["NDA", "BackgroundCheck", "IdProof", "InsuranceCertificate", "Other"] as const;

export class AddDocumentDto {
  @IsIn(DOCUMENT_TYPES)
  documentType!: (typeof DOCUMENT_TYPES)[number];

  @IsUUID()
  fileId!: string;
}
