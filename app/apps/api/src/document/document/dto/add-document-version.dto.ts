import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class AddDocumentVersionDto {
  /** Must already be uploaded via POST /files. */
  @IsUUID()
  fileId!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
