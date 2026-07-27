import { IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const CATEGORIES = ["Policy", "Contract", "Certificate", "Form", "Report", "Other"] as const;

export class CreateDocumentDto {
  @IsString()
  @Length(1, 200)
  title!: string;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsUUID()
  retentionPolicyId?: string;

  /** Must already be uploaded via POST /files. */
  @IsUUID()
  fileId!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
